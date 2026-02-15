import "./login.css";

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  type ConfirmationResult,
  RecaptchaVerifier,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
} from "firebase/auth";
import React, { type ChangeEvent, type FormEvent } from "react";

import { appleProvider, auth, googleProvider } from "../../firebase";

// Route for /login
export const Route = createFileRoute("/_auth/login")({
  component: Login,
});

function Login() {
  const navigate = useNavigate();

  // Form state
  const [form, setForm] = React.useState({
    email: "",
    password: "",
  });

  // Error message
  const [error, setError] = React.useState<null | string>(null);

  // Disable buttons while submitting
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Phone auth state
  const [showPhoneModal, setShowPhoneModal] = React.useState(false);
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [verificationCode, setVerificationCode] = React.useState("");
  const [confirmationResult, setConfirmationResult] = React.useState<ConfirmationResult | null>(null);
  const [isCodeSent, setIsCodeSent] = React.useState(false);
  const recaptchaContainerRef = React.useRef<HTMLDivElement>(null);
  const recaptchaVerifierRef = React.useRef<null | RecaptchaVerifier>(null);

  // Update form values
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Email + password sign in (Firebase)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const email = form.email.trim();
    const password = form.password.trim();

    if (!email || !password) {
      setError("Please enter both email and password.");

      return;
    }

    try {
      setIsSubmitting(true);

      // Firebase email/password sign-in
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const { user } = credential;

      if (!user.emailVerified) {
        setError("Please verify your email before signing in.");

        return;
      }

      console.log("Email sign-in success:", user);

      // after successful login, go to index page
      navigate({ to: "/" });
    } catch (err: any) {
      console.error("Email sign-in error:", err);

      // error msg
      let message = "Login failed. Please check your email and password.";

      if (err?.code === "auth/user-not-found") {
        message = "No account found with this email.";
      } else if (err?.code === "auth/wrong-password") {
        message = "Incorrect password. Please try again.";
      } else if (err?.code === "auth/too-many-requests") {
        message = "Too many attempts. Please try again later.";
      }

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google sign in with Firebase
  const handleGoogleSignIn = async () => {
    setError(null);

    try {
      setIsSubmitting(true);

      // Invoke Firebase Google sign-in popup
      const result = await signInWithPopup(auth, googleProvider);
      const { user } = result;

      console.log("Google sign-in success:", user);

      // After successful login, go to index page
      navigate({ to: "/" });
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError("Google sign-in failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Apple sign in with Firebase
  const handleAppleSignIn = async () => {
    setError(null);

    try {
      setIsSubmitting(true);

      const result = await signInWithPopup(auth, appleProvider);
      const { user } = result;

      console.log("Apple sign-in success:", user);

      navigate({ to: "/" });
    } catch (err: any) {
      console.error("Apple sign-in error:", err);

      if (err?.code === "auth/popup-closed-by-user") {
        setError("Sign-in cancelled.");
      } else {
        setError("Apple sign-in failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open phone sign-in modal
  const handlePhoneSignInClick = () => {
    setError(null);
    setPhoneNumber("");
    setVerificationCode("");
    setIsCodeSent(false);
    setConfirmationResult(null);
    setShowPhoneModal(true);
  };

  // Send verification code
  const handleSendCode = async () => {
    setError(null);

    const trimmedPhone = phoneNumber.trim();

    if (!trimmedPhone) {
      setError("Please enter your phone number.");

      return;
    }

    // Ensure phone number starts with +
    const formattedPhone = trimmedPhone.startsWith("+") ? trimmedPhone : `+${trimmedPhone}`;

    try {
      setIsSubmitting(true);

      // Initialize reCAPTCHA if not already done
      if (!recaptchaVerifierRef.current && recaptchaContainerRef.current) {
        recaptchaVerifierRef.current = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
          size: "invisible",
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- ref is guaranteed to be set above
      const result = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifierRef.current!);

      setConfirmationResult(result);
      setIsCodeSent(true);
      console.log("Verification code sent to:", formattedPhone);
    } catch (err: any) {
      console.error("Send code error:", err);
      let message = "Failed to send verification code.";

      if (err?.code === "auth/invalid-phone-number") {
        message = "Invalid phone number format. Please use +[country code][number].";
      } else if (err?.code === "auth/too-many-requests") {
        message = "Too many requests. Please try again later.";
      }

      setError(message);
      // Reset reCAPTCHA on error
      recaptchaVerifierRef.current = null;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Verify code and sign in
  const handleVerifyCode = async () => {
    setError(null);

    if (!verificationCode.trim()) {
      setError("Please enter the verification code.");

      return;
    }

    if (!confirmationResult) {
      setError("Please send verification code first.");

      return;
    }

    try {
      setIsSubmitting(true);

      const credential = await confirmationResult.confirm(verificationCode.trim());

      console.log("Phone sign-in success:", credential.user);

      setShowPhoneModal(false);
      navigate({ to: "/" });
    } catch (err: any) {
      console.error("Verify code error:", err);
      let message = "Invalid verification code.";

      if (err?.code === "auth/invalid-verification-code") {
        message = "Invalid verification code. Please try again.";
      } else if (err?.code === "auth/code-expired") {
        message = "Verification code expired. Please request a new one.";
      }

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close phone modal
  const handleClosePhoneModal = () => {
    setShowPhoneModal(false);
    setError(null);
  };

  return (
    <div className="login-page">
      <div className="login-bg-overlay">
        <div className="login-card">
          <h1 className="login-title">Sign in</h1>

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >
            {/* Email field */}
            <div className="login-field">
              <label className="login-label">Email</label>
              <input
                className="login-input"
                name="email"
                onChange={handleChange}
                placeholder="Enter your email"
                type="email"
                value={form.email}
              />
            </div>

            {/* Password field */}
            <div className="login-field">
              <label className="login-label">Password</label>
              <input
                className="login-input"
                name="password"
                onChange={handleChange}
                placeholder="Enter your password"
                type="password"
                value={form.password}
              />
            </div>

            {/* Error message */}
            {error && <p className="login-error">{error}</p>}

            {/* Forgot password link → reset page */}
            <p className="login-forgot">
              <Link
                className="forgot-password-btn"
                to="/forgot-password"
              >
                Forgot password?
              </Link>
            </p>

            {/* Sign in button */}
            <button
              className="login-button"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Signing in…" : "Sign in"}
            </button>

            {/* Google login button */}
            <button
              className="google-button"
              disabled={isSubmitting}
              onClick={handleGoogleSignIn}
              type="button"
            >
              Continue with Google
            </button>

            {/* Apple login button */}
            <button
              className="apple-button"
              disabled={isSubmitting}
              onClick={handleAppleSignIn}
              type="button"
            >
              Continue with Apple
            </button>

            {/* Phone login button */}
            <button
              className="phone-button"
              disabled={isSubmitting}
              onClick={handlePhoneSignInClick}
              type="button"
            >
              Continue with Phone
            </button>
          </form>

          {/* Register link */}
          <p className="login-footer">
            Don&apos;t have an account?{" "}
            <Link
              className="login-link"
              to="/register"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* Phone sign-in modal */}
      {showPhoneModal && (
        <div
          className="phone-modal-overlay"
          onClick={handleClosePhoneModal}
        >
          <div
            className="phone-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="phone-modal-title">{isCodeSent ? "Enter Verification Code" : "Phone Sign In"}</h2>

            {!isCodeSent ?
              <>
                <input
                  className="login-input"
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 234 567 8900"
                  type="tel"
                  value={phoneNumber}
                />
                <p className="phone-hint">Include country code (e.g., +1 for US, +86 for China)</p>
              </>
            : <input
                className="login-input"
                maxLength={6}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                type="text"
                value={verificationCode}
              />
            }

            {error && <p className="login-error">{error}</p>}

            <div className="phone-modal-buttons">
              <button
                className="phone-modal-cancel"
                disabled={isSubmitting}
                onClick={handleClosePhoneModal}
                type="button"
              >
                Cancel
              </button>
              {!isCodeSent ?
                <button
                  className="phone-modal-submit"
                  disabled={isSubmitting}
                  onClick={handleSendCode}
                  type="button"
                >
                  {isSubmitting ? "Sending..." : "Send Code"}
                </button>
              : <button
                  className="phone-modal-submit"
                  disabled={isSubmitting}
                  onClick={handleVerifyCode}
                  type="button"
                >
                  {isSubmitting ? "Verifying..." : "Verify"}
                </button>
              }
            </div>
          </div>
        </div>
      )}

      {/* reCAPTCHA container (invisible) */}
      <div
        id="recaptcha-container"
        ref={recaptchaContainerRef}
      />
    </div>
  );
}
