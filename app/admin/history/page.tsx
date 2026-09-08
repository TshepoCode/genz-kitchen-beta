"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowLeft,
  Banknote,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  CreditCard,
  History,
  RefreshCw,
  ShoppingBag,
  ShoppingCart,
  WalletCards,
} from "lucide-react";

type SaleItem = {
  id: string;
  sale_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  created_at: string;
};

type Sale = {
  id: string;
  total: number;
  paymentMethod: string;
  createdAt: string;
  items: SaleItem[];
};

type HistoryDay = {
  date: string;

  totalSales: number;
  orders: number;
  itemsSold: number;

  payments: {
    cash: number;
    eft: number;
    website: number;
  };

  sales: Sale[];
};

type HistoryResponse = {
  success: boolean;

  summary: {
    totalRevenue: number;
    totalOrders: number;
    totalItems: number;
    tradingDays: number;
  };

  history: HistoryDay[];
};

export default function HistoryPage() {
  const [data, setData] =
    useState<HistoryResponse | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [
    expandedDate,
    setExpandedDate,
  ] = useState<string | null>(
    null
  );

  async function loadHistory(
    manual = false
  ) {
    try {
      if (manual) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response =
        await fetch(
          "/api/kitchen/history",
          {
            cache: "no-store",
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Could not load sales history."
        );
      }

      setData(result);
    } catch (err) {
      console.error(
        "History error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Could not load history."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  function money(
    amount: number
  ) {
    return `R${Number(
      amount || 0
    ).toFixed(2)}`;
  }

  function formatDate(
    dateString: string
  ) {
    return new Intl.DateTimeFormat(
      "en-ZA",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    ).format(
      new Date(
        `${dateString}T12:00:00`
      )
    );
  }

  function formatDay(
    dateString: string
  ) {
    return new Intl.DateTimeFormat(
      "en-ZA",
      {
        weekday: "long",
      }
    ).format(
      new Date(
        `${dateString}T12:00:00`
      )
    );
  }

  function formatTime(
    dateString: string
  ) {
    return new Intl.DateTimeFormat(
      "en-ZA",
      {
        timeZone:
          "Africa/Johannesburg",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }
    ).format(
      new Date(dateString)
    );
  }

  function paymentName(
    method: string
  ) {
    if (method === "cash")
      return "Cash";

    if (method === "eft")
      return "EFT";

    if (method === "website")
      return "Website";

    return method;
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-center">
          <RefreshCw className="mx-auto mb-4 animate-spin text-lime-500" />

          <p className="font-black text-slate-900">
            Loading sales history...
          </p>
        </div>
      </main>
    );
  }

  const summary =
    data?.summary || {
      totalRevenue: 0,
      totalOrders: 0,
      totalItems: 0,
      tradingDays: 0,
    };

  const history =
    data?.history || [];

  return (
    <main className="min-h-screen bg-slate-100">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <Link
              href="/admin/kitchen"
              className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-black"
            >
              <ArrowLeft
                size={18}
              />

              Kitchen Dashboard
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-lime-400">
                <History
                  size={23}
                />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-lime-600">
                  GenZ Kitchen
                </p>

                <h1 className="text-2xl font-black text-slate-950 sm:text-3xl">
                  Sales History
                </h1>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              loadHistory(true)
            }
            disabled={refreshing}
            className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
          >
            <RefreshCw
              size={17}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 font-bold text-red-700">
            {error}
          </div>
        )}

        {/* OVERALL SUMMARY */}
        <section className="mb-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              title="Total Sales"
              value={money(
                summary.totalRevenue
              )}
            />

            <SummaryCard
              title="Total Orders"
              value={String(
                summary.totalOrders
              )}
            />

            <SummaryCard
              title="Items Sold"
              value={String(
                summary.totalItems
              )}
            />

            <SummaryCard
              title="Trading Days"
              value={String(
                summary.tradingDays
              )}
            />
          </div>
        </section>

        {/* HISTORY */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-black text-slate-950">
              Trading Days
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Every day's recorded
              GenZ Kitchen sales.
            </p>
          </div>

          {history.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
              <CalendarDays className="mx-auto mb-4 text-slate-300" />

              <p className="font-black text-slate-800">
                No sales history yet
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map(
                (day) => {
                  const expanded =
                    expandedDate ===
                    day.date;

                  return (
                    <div
                      key={
                        day.date
                      }
                      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                    >
                      {/* DAY HEADER */}
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedDate(
                            expanded
                              ? null
                              : day.date
                          )
                        }
                        className="w-full p-5 text-left transition hover:bg-slate-50 sm:p-6"
                      >
                        <div className="flex items-start justify-between gap-5">
                          <div>
                            <p className="text-xs font-black uppercase tracking-[0.16em] text-lime-600">
                              {formatDay(
                                day.date
                              )}
                            </p>

                            <h3 className="mt-1 text-xl font-black text-slate-950">
                              {formatDate(
                                day.date
                              )}
                            </h3>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-xs font-bold uppercase text-slate-400">
                                Sales
                              </p>

                              <p className="text-xl font-black text-slate-950">
                                {money(
                                  day.totalSales
                                )}
                              </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                              {expanded ? (
                                <ChevronUp
                                  size={
                                    19
                                  }
                                />
                              ) : (
                                <ChevronDown
                                  size={
                                    19
                                  }
                                />
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                          <MiniStat
                            label="Orders"
                            value={String(
                              day.orders
                            )}
                          />

                          <MiniStat
                            label="Items"
                            value={String(
                              day.itemsSold
                            )}
                          />

                          <MiniStat
                            label="Average"
                            value={money(
                              day.orders >
                                0
                                ? day.totalSales /
                                    day.orders
                                : 0
                            )}
                          />
                        </div>
                      </button>

                      {/* EXPANDED */}
                      {expanded && (
                        <div className="border-t border-slate-200 bg-slate-50 p-5 sm:p-6">
                          {/* PAYMENTS */}
                          <div className="grid gap-3 sm:grid-cols-3">
                            <PaymentCard
                              title="Cash"
                              amount={
                                day
                                  .payments
                                  .cash
                              }
                              icon={
                                <Banknote
                                  size={
                                    18
                                  }
                                />
                              }
                            />

                            <PaymentCard
                              title="EFT"
                              amount={
                                day
                                  .payments
                                  .eft
                              }
                              icon={
                                <CreditCard
                                  size={
                                    18
                                  }
                                />
                              }
                            />

                            <PaymentCard
                              title="Website"
                              amount={
                                day
                                  .payments
                                  .website
                              }
                              icon={
                                <WalletCards
                                  size={
                                    18
                                  }
                                />
                              }
                            />
                          </div>

                          {/* SALES */}
                          <div className="mt-6">
                            <h4 className="mb-3 font-black text-slate-950">
                              Sales
                            </h4>

                            <div className="space-y-3">
                              {day.sales.map(
                                (
                                  sale
                                ) => (
                                  <div
                                    key={
                                      sale.id
                                    }
                                    className="rounded-2xl border border-slate-200 bg-white p-4"
                                  >
                                    <div className="flex items-start justify-between gap-4">
                                      <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                          <p className="text-lg font-black text-slate-950">
                                            {money(
                                              sale.total
                                            )}
                                          </p>

                                          <span className="rounded-full bg-lime-100 px-2.5 py-1 text-xs font-black text-lime-800">
                                            {paymentName(
                                              sale.paymentMethod
                                            )}
                                          </span>
                                        </div>

                                        <p className="mt-1 text-xs font-semibold text-slate-400">
                                          {formatTime(
                                            sale.createdAt
                                          )}
                                        </p>
                                      </div>

                                      <ShoppingCart className="text-slate-300" />
                                    </div>

                                    <div className="mt-4 border-t border-slate-100 pt-3">
                                      <div className="space-y-2">
                                        {sale.items.map(
                                          (
                                            item
                                          ) => (
                                            <div
                                              key={
                                                item.id
                                              }
                                              className="flex items-center justify-between gap-3 text-sm"
                                            >
                                              <div className="flex items-center gap-2">
                                                <span className="flex h-6 min-w-6 items-center justify-center rounded-lg bg-slate-100 px-2 text-xs font-black text-slate-700">
                                                  {
                                                    item.quantity
                                                  }
                                                  ×
                                                </span>

                                                <span className="font-semibold text-slate-700">
                                                  {
                                                    item.product_name
                                                  }
                                                </span>
                                              </div>

                                              <span className="font-black text-slate-900">
                                                {money(
                                                  Number(
                                                    item.price
                                                  ) *
                                                    Number(
                                                      item.quantity
                                                    )
                                                )}
                                              </span>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function SummaryCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-lime-400">
        <ShoppingBag size={20} />
      </div>

      <p className="text-sm font-bold text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-black text-slate-950">
        {value}
      </p>
    </div>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-100 p-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 font-black text-slate-900">
        {value}
      </p>
    </div>
  );
}

function PaymentCard({
  title,
  amount,
  icon,
}: {
  title: string;
  amount: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-lime-400">
          {icon}
        </div>

        <p className="font-black text-slate-950">
          R{amount.toFixed(2)}
        </p>
      </div>

      <p className="mt-3 text-sm font-bold text-slate-500">
        {title}
      </p>
    </div>
  );
}