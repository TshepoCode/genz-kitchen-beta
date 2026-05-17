"use client";

import { useState } from "react";

type ActionType = "add" | "subtract";

export default function AdminPage() {
  const [adminEmail, setAdminEmail] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [pointsAmount, setPointsAmount] = useState("");

  const [action, setAction] = useState<ActionType>("add");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const updatePoints = async () => {
    setResult("");
    setError("");

    if (!adminEmail || !customerEmail || !pointsAmount) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/add-points", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminEmail,
          customerEmail,
          pointsToAdd: Number(pointsAmount),
          action,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to update points.");
        return;
      }

      setResult(
        `${data.customerName} now has ${data.newPoints} points. ${
          action === "add"
            ? `Added ${data.addedPoints} points.`
            : `Subtracted ${data.subtractedPoints} points.`
        }`
      );

      setCustomerEmail("");
      setPointsAmount("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white px-4 py-10 text-black">
      <div className="mx-auto max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-3xl font-extrabold">
          GenZ Kitchen{" "}
          <span className="text-lime-500">Admin Points</span>
        </h1>

        <p className="mb-6 text-sm text-zinc-500">
          Add or subtract customer reward points after confirming orders.
        </p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Admin email"
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-lime-400"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
          />

          <input
            type="email"
            placeholder="Customer email"
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-lime-400"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
          />

          <input
            type="number"
            placeholder="Points amount"
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-lime-400"
            value={pointsAmount}
            onChange={(e) => setPointsAmount(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setAction("add")}
              className={`rounded-xl px-4 py-3 font-bold transition ${
                action === "add"
                  ? "bg-lime-400 text-black"
                  : "bg-black text-white"
              }`}
            >
              Add Points
            </button>

            <button
              type="button"
              onClick={() => setAction("subtract")}
              className={`rounded-xl px-4 py-3 font-bold transition ${
                action === "subtract"
                  ? "bg-red-600 text-white"
                  : "bg-black text-white"
              }`}
            >
              Subtract Points
            </button>
          </div>

          <button
            onClick={updatePoints}
            disabled={loading}
            className="w-full rounded-xl bg-black px-4 py-3 font-bold text-white transition hover:bg-lime-500 hover:text-black disabled:opacity-50"
          >
            {loading
              ? "Updating Points..."
              : action === "add"
              ? "Add Points"
              : "Subtract Points"}
          </button>

          {result && (
            <div className="rounded-2xl border border-lime-200 bg-lime-50 p-4">
              <p className="text-sm font-semibold text-lime-800">
                {result}
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-700">
                {error}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}