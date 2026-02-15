import "./login.css";

import { createFileRoute, Link } from "@tanstack/react-router";
import { sendPasswordResetEmail } from "firebase/auth";
import React, { type ChangeEvent, type FormEvent } from "react";

import { auth } from "../../firebase";

// Step1: Email only → send reset email
export const Route = createFileRoute("/_auth/forgot-password")({
  component: ForgotPasswordStep1,
});

function ForgotPasswordStep1() {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState<null | string>(null);
  const [success, setSuccess] = React.useState<null | string>(null);
  const [isSending, setIsSending] = React.useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // submit: send reset email
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmed = email.trim();

    if (!trimmed) {
      setError("Please enter your email.");

      return;
    }

    try {
      setIsSending(true);

      // set the "where to go after reset" in the email
      const actionCodeSettings = {
        handleCodeInApp: true,
        url: `${window.location.origin}/forgot-password-reset`,
      };

      // send the reset password email
      await sendPasswordResetEmail(auth, trimmed, actionCodeSettings);

      setSuccess(`Password reset email sent to ${trimmed}. Please check your inbox.`);
    } catch (err: any) {
      console.error("Reset email error:", err);
      let msg = "Failed to send reset email.";

      if (err?.code === "auth/user-not-found") {
        msg = "No account found with this email.";
      } else if (err?.code === "auth/invalid-email") {
        msg = "Invalid email address.";
      }

      setError(msg);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-overlay">
        <div className="login-card">
          <h1 className="login-title">Reset password</h1>

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >
            {/* Email */}
            <div className="login-field">
              <label className="login-label">Email</label>
              <input
                className="login-input"
                name="email"
                onChange={handleChange}
                placeholder="you@example.com"
                type="email"
                value={email}
              />
            </div>

            {/* Error / success */}
            {error && <p className="login-error">{error}</p>}
            {success && <p className="login-success">{success}</p>}

            <button
              className="login-button"
              disabled={isSending}
              type="submit"
            >
              {isSending ? "Sending…" : "Send reset email"}
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
