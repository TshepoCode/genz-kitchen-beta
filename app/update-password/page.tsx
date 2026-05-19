"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [message, setMessage] = useState("Checking reset link...");

  useEffect(() => {
    const setupRecoverySession = async () => {
      try {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));

        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            setMessage("Password reset link is invalid or expired.");
            setSessionReady(false);
            return;
          }

          setMessage("Reset link verified. Enter your new password.");
          setSessionReady(true);
          return;
        }

        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
          setMessage("Reset link is missing or expired. Please request a new one.");
          setSessionReady(false);
          return;
        }

        setMessage("Reset link verified. Enter your new password.");
        setSessionReady(true);
      } catch {
        setMessage("Something went wrong. Please request a new reset link.");
        setSessionReady(false);
      }
    };

    setupRecoverySession();
  }, []);

  const updatePassword = async () => {
    if (!sessionReady) {
      alert("Reset link is not ready. Please request a new password reset email.");
      return;
    }

    if (!password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Password updated successfully. Please login.");

    await supabase.auth.signOut();

    window.location.href = "/login";
  };

  return (
    <main className="min-h-screen bg-white px-4 py-10 text-black">
      <div className="mx-auto max-w-md rounded-2xl border border-zinc-200 p-6 shadow-sm">
        <h1 className="mb-2 text-center text-2xl font-bold">
          Create New Password
        </h1>

        <p className="mb-6 text-center text-sm text-zinc-500">
          {message}
        </p>

        <div className="space-y-3">
          <input
            type="password"
            placeholder="New password"
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-lime-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm new password"
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-lime-400"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            onClick={updatePassword}
            disabled={loading || !sessionReady}
            className="w-full rounded-xl bg-lime-400 px-4 py-3 font-bold text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Updating password..." : "Update Password"}
          </button>
        </div>
      </div>
    </main>
  );
}