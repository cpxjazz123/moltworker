import "./login.css";

import { createFileRoute, Link } from "@tanstack/react-router";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import React, { type ChangeEvent, type FormEvent } from "react";

import { auth } from "../../firebase";

export const Route = createFileRoute("/_auth/register")({
  component: Register,
});

function Register() {
  // Form data
  const [form, setForm] = React.useState({
    email: "",
    password: "",
  });

  // UI states
  const [error, setError] = React.useState<null | string>(null);
  const [success, setSuccess] = React.useState<null | string>(null);
  const [isSending, setIsSending] = React.useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form: create account + send verification email
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const email = form.email.trim();
    const password = form.password.trim();

    if (!email || !password) {
      setError("Please enter both email and password.");

      return;
    }

    try {
      setIsSending(true);

      // create account
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = cred;

      // send verification email
      await sendEmailVerification(user);

      setSuccess(`Verification email has been sent to ${email}. Please check your inbox (and spam folder).`);
    } catch (err: any) {
      console.error("Register error:", err);
      let msg = "Failed to create account or send verification email.";

      if (err?.code === "auth/email-already-in-use") {
        msg = "This email is already in use.";
      } else if (err?.code === "auth/invalid-email") {
        msg = "Invalid email address.";
      } else if (err?.code === "auth/weak-password") {
        msg = "Password should be at least 6 characters.";
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
          <h1 className="login-title">Create account</h1>

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
                placeholder="you@example.com"
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
                placeholder="Create a password"
                type="password"
                value={form.password}
              />
            </div>

            {/* Error / success message */}
            {error && <p className="login-error">{error}</p>}
            {success && <p className="login-success">{success}</p>}

            {/* Submit: create account + send verification email */}
            <button
              className="login-button"
              disabled={isSending}
              type="submit"
            >
              {isSending ? "Sending…" : "Send verification email"}
            </button>
          </form>

          <p className="login-footer">
            Already have an account?{" "}
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
