import "./login.css";

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import React, { type ChangeEvent, type FormEvent } from "react";

import { auth } from "../../firebase";

// Step2: Set new password
export const Route = createFileRoute("/_auth/forgot-password-reset")({
  component: ForgotPasswordReset,
  validateSearch: (search: Record<string, unknown>): { oobCode?: string } => {
    return { oobCode: typeof search.oobCode === "string" ? search.oobCode : undefined };
  },
});

function ForgotPasswordReset() {
  const navigate = useNavigate();

  // get oobCode from URL
  const search = Route.useSearch();
  const oobCode = search.oobCode ?? "";

  const [email, setEmail] = React.useState<string>("");
  const [form, setForm] = React.useState({
    confirmPassword: "",
    newPassword: "",
  });

  const [error, setError] = React.useState<null | string>(null);
  const [success, setSuccess] = React.useState<null | string>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [countdown, setCountdown] = React.useState<null | number>(null);
  const [isVerifying, setIsVerifying] = React.useState(true);

  // check the oobCode validity on mount
  React.useEffect(() => {
    const verify = async () => {
      try {
        if (!oobCode) {
          setError("Invalid or missing reset code.");
          setIsVerifying(false);

          return;
        }

        const emailFromLink = await verifyPasswordResetCode(auth, oobCode);

        setEmail(emailFromLink);
      } catch (err) {
        console.error("Verify reset code error:", err);
        setError("Reset link is invalid or has expired.");
      } finally {
        setIsVerifying(false);
      }
    };

    void verify();
  }, [oobCode]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // submit: confirm password reset
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (form.newPassword.length < 6) {
      setError("Password must be at least 6 characters.");

      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match.");

      return;
    }

    if (!oobCode) {
      setError("Missing reset code.");

      return;
    }

    try {
      setIsSubmitting(true);

      // invoke Firebase API to confirm password reset
      await confirmPasswordReset(auth, oobCode, form.newPassword);

      setSuccess("Password reset successfully!");
      setCountdown(3);
    } catch (err) {
      console.error("Confirm reset error:", err);
      setError("Failed to reset password. The link may have expired.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // go back to login after countdown
  React.useEffect(() => {
    if (countdown === null) {
      return;
    }

    if (countdown <= 0) {
      navigate({ to: "/login" });

      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  if (isVerifying) {
    return (
      <div className="login-page">
        <div className="login-bg-overlay">
          <div className="login-card">
            <h1 className="login-title">Checking reset link…</h1>
          </div>
        </div>
      </div>
    );
  }

  if (error && !success) {
    return (
      <div className="login-page">
        <div className="login-bg-overlay">
          <div className="login-card">
            <h1 className="login-title">Reset password</h1>
            <p className="login-error">{error}</p>
            <p className="login-footer">
              Back to{" "}
              <Link
                className="login-link"
                to="/forgot-password"
              >
                Forgot password
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-bg-overlay">
        <div className="login-card">
          <h1 className="login-title">Set new password</h1>

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >
            {/* Email preview */}
            {email && (
              <p style={{ fontSize: 14, margin: 0, opacity: 0.8 }}>
                For: <strong>{email}</strong>
              </p>
            )}

            {/* New password */}
            <div className="login-field">
              <label className="login-label">New password</label>
              <input
                className="login-input"
                name="newPassword"
                onChange={handleChange}
                placeholder="Enter a new password"
                type="password"
                value={form.newPassword}
              />
            </div>

            {/* Confirm password */}
            <div className="login-field">
              <label className="login-label">Confirm password</label>
              <input
                className="login-input"
                name="confirmPassword"
                onChange={handleChange}
                placeholder="Repeat new password"
                type="password"
                value={form.confirmPassword}
              />
            </div>

            {/* Error / success */}
            {error && <p className="login-error">{error}</p>}
            {success && (
              <p className="login-success">
                {success}
                {countdown !== null && countdown > 0 && <> — Returning in {countdown}s…</>}
              </p>
            )}

            <button
              className="login-button"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Saving…" : "Reset password"}
            </button>
          </form>

          <p className="login-footer">
            Back to{" "}
            <Link
              className="login-link"
              to="/login"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
