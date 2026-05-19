"use client";

import { createClient } from "@supabase/supabase-js";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showResetForm, setShowResetForm] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const hasLowercase = /[a-z]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const hasMinLength = password.length >= 6;

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setResetEmail("");
    setShowResetForm(false);
    setShowPassword(false);
  };

  const handlePasswordReset = async () => {
    if (resetLoading) return;

    const cleanResetEmail = resetEmail.trim().toLowerCase();

    if (!cleanResetEmail) {
      alert("Please enter your account email address.");
      return;
    }

    setResetLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        cleanResetEmail,
        {
          redirectTo: `${window.location.origin}/update-password`,
        }
      );

      if (error) {
        alert(`Error sending recovery email: ${error.message}`);
        return;
      }

      alert("Password reset email sent. Please check your inbox or spam folder.");
      setResetEmail("");
      setShowResetForm(false);
    } finally {
      setResetLoading(false);
    }
  };

  const handleAuth = async () => {
    if (loading) return;

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      alert("Please enter your email and password.");
      return;
    }

    if (!isLogin && !fullName.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (!isLogin && !confirmPassword) {
      alert("Please confirm your password.");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!isLogin && !hasMinLength) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (!isLogin && (!hasLowercase || !hasSymbol)) {
      alert(
        "Please include lowercase letters and symbols to make your password stronger."
      );
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) {
          alert(error.message);
          return;
        }

        resetForm();
        window.location.href = "/menu";
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (error) {
        alert(error.message);
        return;
      }

      if (data.user) {
        const profileResponse = await fetch("/api/create-profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: data.user.id,
            fullName: fullName.trim(),
            email: cleanEmail,
          }),
        });

        const profileData = await profileResponse.json();

        if (!profileResponse.ok) {
          alert(profileData.error || "Account created, but profile setup failed.");
          return;
        }
      }

      alert("Account created successfully. You can now login.");
      setIsLogin(true);
      resetForm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white px-4 py-10 text-black">
      <div className="mx-auto max-w-md rounded-2xl border border-zinc-200 p-6 shadow-sm">
        <h1 className="mb-2 text-center text-2xl font-bold">
          {showResetForm
            ? "Reset Password"
            : isLogin
            ? "Login to GenZ Kitchen"
            : "Create GenZ Kitchen Account"}
        </h1>

        <p className="mb-6 text-center text-sm text-zinc-500">
          {showResetForm
            ? "Enter the email linked to your account."
            : isLogin
            ? "Welcome back. Login to continue."
            : "Sign up first before you can login."}
        </p>

        {!showResetForm ? (
          <>
            <div className="space-y-3">
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Full name"
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-lime-400"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              )}

              <input
                type="email"
                placeholder="Email address"
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-lime-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 pr-14 outline-none focus:border-lime-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {!isLogin && (
                <>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-lime-400"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />

                  <div className="rounded-xl bg-zinc-50 p-4 text-xs text-zinc-600">
                    <p className="mb-2 font-bold text-black">
                      Password strength tips:
                    </p>

                    <p
                      className={
                        hasMinLength ? "text-lime-600" : "text-zinc-500"
                      }
                    >
                      Must be at least 6 characters
                    </p>

                    <p
                      className={
                        hasLowercase ? "text-lime-600" : "text-zinc-500"
                      }
                    >
                      Include lowercase letters
                    </p>

                    <p
                      className={
                        hasSymbol ? "text-lime-600" : "text-zinc-500"
                      }
                    >
                      Include symbols like ! @ # $ %
                    </p>
                  </div>
                </>
              )}

              <button
                type="button"
                onClick={handleAuth}
                disabled={loading || resetLoading}
                className="w-full rounded-xl bg-lime-400 px-4 py-3 font-bold text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-zinc-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  resetForm();
                }}
                disabled={loading || resetLoading}
                className="font-bold text-lime-500 hover:text-lime-600 disabled:opacity-50"
              >
                {isLogin ? "Sign up" : "Login"}
              </button>
            </p>

            {isLogin && (
              <p className="mt-4 text-center text-sm text-zinc-600">
                Forgot your password?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setShowResetForm(true);
                    setResetEmail("");
                  }}
                  disabled={loading || resetLoading}
                  className="font-bold text-blue-500 hover:text-blue-600 disabled:opacity-50"
                >
                  Reset it here.
                </button>
              </p>
            )}
          </>
        ) : (
          <div className="space-y-3">
            <input
              type="email"
              placeholder="Enter your account email"
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-lime-400"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />

            <button
              type="button"
              onClick={handlePasswordReset}
              disabled={loading || resetLoading}
              className="w-full rounded-xl bg-black px-4 py-3 font-bold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {resetLoading ? "Sending email..." : "Send Reset Email"}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowResetForm(false);
                setResetEmail("");
              }}
              disabled={resetLoading}
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 font-bold text-zinc-600 transition hover:bg-zinc-100 disabled:opacity-50"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </main>
  );
}