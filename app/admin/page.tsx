"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  ChefHat,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

type ActionType = "add" | "subtract";

export default function AdminPage() {
  const pathname = usePathname();

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

    const points = Number(pointsAmount);

    if (Number.isNaN(points) || points <= 0) {
      setError("Please enter a valid points amount.");
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
          pointsToAdd: points,
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
      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            ADMIN HEADER
        ===================================================== */}

        <div className="mb-8 flex flex-col gap-5 border-b border-zinc-200 pb-7 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-lime-600">
              <ShieldCheck className="h-4 w-4" />
              GenZ Kitchen Admin
            </div>

            <h1 className="mt-2 text-3xl font-black">
              Administration
            </h1>

            <p className="mt-2 max-w-xl text-sm text-zinc-500">
              Manage kitchen operations and customer reward points.
            </p>
          </div>

          {/* KITCHEN DASHBOARD LINK */}

          <Link
            href="/admin/kitchen"
            className={`group flex items-center gap-3 rounded-2xl px-5 py-3 font-bold transition ${
              pathname === "/admin/kitchen"
                ? "bg-lime-400 text-black"
                : "bg-black text-white hover:bg-lime-400 hover:text-black"
            }`}
          >
            <ChefHat className="h-5 w-5" />

            Kitchen Dashboard

            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* =====================================================
            ADMIN CONTENT
        ===================================================== */}

        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">

          {/* =================================================
              KITCHEN OPERATIONS CARD
          ================================================= */}

          <section className="rounded-3xl bg-black p-7 text-white">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-400 text-black">
              <ChefHat className="h-7 w-7" />
            </div>

            <p className="mt-6 text-sm font-bold uppercase tracking-wider text-lime-400">
              Kitchen Operations
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Manage Today&apos;s Kitchen
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">
              Start the trading day, capture opening stock, record confirmed
              customer sales, monitor stock, record expenses and complete the
              end-of-day close.
            </p>

            {/* WORKFLOW */}

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-zinc-900 p-4">
                <p className="text-xs font-bold text-lime-400">
                  01
                </p>

                <p className="mt-2 font-bold">
                  Start of Day
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  Capture opening stock.
                </p>
              </div>

              <div className="rounded-2xl bg-zinc-900 p-4">
                <p className="text-xs font-bold text-lime-400">
                  02
                </p>

                <p className="mt-2 font-bold">
                  Record Sales
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  Record confirmed orders.
                </p>
              </div>

              <div className="rounded-2xl bg-zinc-900 p-4">
                <p className="text-xs font-bold text-lime-400">
                  03
                </p>

                <p className="mt-2 font-bold">
                  Track Stock
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  Monitor remaining products.
                </p>
              </div>

              <div className="rounded-2xl bg-zinc-900 p-4">
                <p className="text-xs font-bold text-lime-400">
                  04
                </p>

                <p className="mt-2 font-bold">
                  End of Day
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  Close and submit the day.
                </p>
              </div>
            </div>

            <Link
              href="/admin/kitchen"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-300 px-6 py-3 font-black text-black transition hover:bg-lime-300"
            >
              Open Kitchen Dashboard

              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/admin/kitchen/sales"
              className="mt-7 ml-5 inline-flex items-center gap-2 rounded-xl bg-lime-400 px-6 py-3 font-black text-black transition hover:bg-lime-300"
            >
              Make sale

              <ArrowRight className="h-4 w-4" />
            </Link>            

          </section>

          {/* =================================================
              POINTS MANAGEMENT
          ================================================= */}

          <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-extrabold">
              Customer{" "}
              <span className="text-lime-500">
                Points
              </span>
            </h2>

            <p className="mb-6 mt-2 text-sm text-zinc-500">
              Add or subtract customer reward points after confirming orders.
            </p>

            <div className="space-y-4">

              {/* ADMIN EMAIL */}

              <div>
                <label className="mb-2 block text-sm font-bold text-zinc-700">
                  Admin Email
                </label>

                <input
                  type="email"
                  placeholder="Admin email"
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-lime-400"
                  value={adminEmail}
                  onChange={(e) =>
                    setAdminEmail(e.target.value)
                  }
                />
              </div>

              {/* CUSTOMER EMAIL */}

              <div>
                <label className="mb-2 block text-sm font-bold text-zinc-700">
                  Customer Email
                </label>

                <input
                  type="email"
                  placeholder="Customer email"
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-lime-400"
                  value={customerEmail}
                  onChange={(e) =>
                    setCustomerEmail(e.target.value)
                  }
                />
              </div>

              {/* POINTS */}

              <div>
                <label className="mb-2 block text-sm font-bold text-zinc-700">
                  Points Amount
                </label>

                <input
                  type="number"
                  min="1"
                  placeholder="Points amount"
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-lime-400"
                  value={pointsAmount}
                  onChange={(e) =>
                    setPointsAmount(e.target.value)
                  }
                />
              </div>

              {/* ACTION */}

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setAction("add")
                  }
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
                  onClick={() =>
                    setAction("subtract")
                  }
                  className={`rounded-xl px-4 py-3 font-bold transition ${
                    action === "subtract"
                      ? "bg-red-600 text-white"
                      : "bg-black text-white"
                  }`}
                >
                  Subtract Points
                </button>
              </div>

              {/* UPDATE BUTTON */}

              <button
                type="button"
                onClick={updatePoints}
                disabled={loading}
                className="w-full rounded-xl bg-black px-4 py-3 font-bold text-white transition hover:bg-lime-500 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Updating Points..."
                  : action === "add"
                  ? "Add Points"
                  : "Subtract Points"}
              </button>

              {/* SUCCESS */}

              {result && (
                <div className="rounded-2xl border border-lime-200 bg-lime-50 p-4">
                  <p className="text-sm font-semibold text-lime-800">
                    {result}
                  </p>
                </div>
              )}

              {/* ERROR */}

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-semibold text-red-700">
                    {error}
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}