// app/admin-login/page.tsx
"use client";

import { createClient } from "@supabase/supabase-js";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL!;

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      alert("Please enter admin email and password.");
      return;
    }

    if (cleanEmail !== ADMIN_EMAIL.toLowerCase()) {
      alert("You are not allowed to access the admin page.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    window.location.href = "/admin";
  };

  return (
    <main className="min-h-screen bg-white px-4 py-10 text-black">
      <div className="mx-auto max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-center text-3xl font-extrabold">
          GenZ Kitchen Admin
        </h1>

        <p className="mb-6 text-center text-sm text-zinc-500">
          Business owner access only.
        </p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Admin email"
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-lime-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Admin password"
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

          <button
            onClick={handleAdminLogin}
            disabled={loading}
            className="w-full rounded-xl bg-black px-4 py-3 font-bold text-white transition hover:bg-lime-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Checking..." : "Login as Admin"}
          </button>
        </div>
      </div>
    </main>
  );
}