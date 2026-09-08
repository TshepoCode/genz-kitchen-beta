"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  Banknote,
  BarChart3,
  ChefHat,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  CreditCard,
  History,
  LayoutDashboard,
  Menu,
  Package,
  Plus,
  Receipt,
  RefreshCw,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  WalletCards,
  X,
} from "lucide-react";

type ProductBreakdown = {
  productId: string;
  productName: string;
  quantity: number;
  sales: number;
};

type SaleItem = {
  id: string;
  sale_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  created_at: string;
};

type RecentSale = {
  id: string;
  total: number;
  paymentMethod: string;
  createdAt: string;
  items: SaleItem[];
};

type DashboardData = {
  success: boolean;

  date: string;

  summary: {
    sales: number;
    orders: number;
    itemsSold: number;
    averageOrder: number;
  };

  payments: {
    cash: number;
    eft: number;
    website: number;
  };

  productBreakdown: ProductBreakdown[];

  recentSales: RecentSale[];
};

const navigation = [
  {
    name: "Dashboard",
    href: "/admin/kitchen",
    icon: LayoutDashboard,
  },
  {
    name: "Sales",
    href: "/admin/sales",
    icon: ShoppingCart,
  },
  {
    name: "Start Day",
    href: "/admin/start-day",
    icon: ClipboardCheck,
  },
  {
    name: "Stock",
    href: "/admin/stock",
    icon: Package,
  },
  {
    name: "Expenses",
    href: "/admin/expenses",
    icon: CircleDollarSign,
  },
  {
    name: "End Day",
    href: "/admin/end-day",
    icon: Receipt,
  },
  {
    name: "History",
    href: "/admin/history",
    icon: History,
  },
];

export default function KitchenDashboardPage() {
  const [data, setData] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const loadDashboard = useCallback(
    async (manualRefresh = false) => {
      try {
        if (manualRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const response = await fetch(
          "/api/kitchen/today",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ||
              "Failed to load dashboard."
          );
        }

        setData(result);
      } catch (err) {
        console.error(
          "Dashboard error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load dashboard."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    loadDashboard();

    const interval = setInterval(() => {
      loadDashboard(true);
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [loadDashboard]);

  function formatMoney(
    amount: number
  ) {
    return `R${Number(
      amount || 0
    ).toFixed(2)}`;
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

  function formatDate(
    dateString?: string
  ) {
    if (!dateString) {
      return "";
    }

    return new Intl.DateTimeFormat(
      "en-ZA",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    ).format(
      new Date(
        `${dateString}T12:00:00`
      )
    );
  }

  function getPaymentLabel(
    paymentMethod: string
  ) {
    if (
      paymentMethod === "cash"
    ) {
      return "Cash";
    }

    if (
      paymentMethod === "eft"
    ) {
      return "EFT";
    }

    if (
      paymentMethod === "website"
    ) {
      return "Website";
    }

    return paymentMethod;
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#eef0f2]">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
            <RefreshCw className="h-6 w-6 animate-spin text-lime-600" />
          </div>

          <p className="font-black text-slate-900">
            Loading GenZ Kitchen...
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Getting today's sales
          </p>
        </div>
      </main>
    );
  }

  const summary =
    data?.summary || {
      sales: 0,
      orders: 0,
      itemsSold: 0,
      averageOrder: 0,
    };

  const payments =
    data?.payments || {
      cash: 0,
      eft: 0,
      website: 0,
    };

  const productBreakdown =
    data?.productBreakdown || [];

  const recentSales =
    data?.recentSales || [];

  return (
    <main className="min-h-screen bg-[#eef0f2] text-slate-950">
      <div className="flex min-h-screen">
        {/* ========================= */}
        {/* DESKTOP SIDEBAR */}
        {/* ========================= */}

        <aside className="hidden w-[230px] shrink-0 border-r border-zinc-800 bg-[#151515] lg:flex lg:flex-col">
          {/* LOGO */}
          <div className="flex h-20 items-center border-b border-zinc-800 px-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400 text-black">
                <ChefHat
                  size={22}
                />
              </div>

              <div>
                <p className="text-lg font-black tracking-tight text-white">
                  GenZKitchen
                </p>

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                  Owner Dashboard
                </p>
              </div>
            </div>
          </div>

          {/* NAVIGATION */}
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map(
              (item) => {
                const Icon =
                  item.icon;

                const active =
                  item.name ===
                  "Dashboard";

                return (
                  <Link
                    key={
                      item.name
                    }
                    href={
                      item.href
                    }
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition ${
                      active
                        ? "bg-lime-400 text-black"
                        : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                    }`}
                  >
                    <Icon
                      size={18}
                    />

                    {
                      item.name
                    }
                  </Link>
                );
              }
            )}
          </nav>

          {/* BOTTOM CARD */}
          <div className="p-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
              <p className="text-xs font-black uppercase tracking-wider text-lime-400">
                Kagiso
              </p>

              <div className="mt-2 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-lime-400" />

                <p className="text-sm font-black text-white">
                  Sales Live
                </p>
              </div>

              <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                Dashboard updates automatically.
              </p>
            </div>
          </div>
        </aside>

        {/* ========================= */}
        {/* MAIN CONTENT */}
        {/* ========================= */}

        <div className="min-w-0 flex-1">
          {/* TOP NAV */}
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
            <div className="flex h-15 items-center justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                {/* MOBILE MENU */}
                <button
                  type="button"
                  onClick={() =>
                    setMobileMenuOpen(
                      true
                    )
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-900 lg:hidden"
                >
                  <Menu
                    size={20}
                  />
                </button>

                {/* MOBILE BRAND */}
                <div className="flex items-center gap-2 lg:hidden">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-400 text-black">
                    <ChefHat
                      size={20}
                    />
                  </div>

                  <p className="font-black text-slate-950">
                    GenZKitchen
                  </p>
                </div>

                {/* DESKTOP TITLE */}
                <div className="hidden lg:block">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    GenZ Kitchen
                  </p>

                  <p className="font-black text-slate-950">
                    Owner Dashboard
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    loadDashboard(
                      true
                    )
                  }
                  disabled={
                    refreshing
                  }
                  className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50"
                >
                  <RefreshCw
                    size={16}
                    className={
                      refreshing
                        ? "animate-spin"
                        : ""
                    }
                  />

                  <span className="hidden sm:inline">
                    Refresh
                  </span>
                </button>

                <Link
                  href="/admin"
                  className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white transition hover:bg-slate-800"
                >
                  Admin
                </Link>
              </div>
            </div>
          </header>

          {/* ========================= */}
          {/* MOBILE MENU */}
          {/* ========================= */}

          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <button
                type="button"
                aria-label="Close menu"
                onClick={() =>
                  setMobileMenuOpen(
                    false
                  )
                }
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />

              <div className="relative h-full w-[280px] border-r border-zinc-800 bg-[#151515] p-4 shadow-2xl">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400 text-black">
                      <ChefHat
                        size={21}
                      />
                    </div>

                    <p className="font-black text-white">
                      GenZKitchen
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setMobileMenuOpen(
                        false
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-zinc-400"
                  >
                    <X
                      size={18}
                    />
                  </button>
                </div>

                <nav className="space-y-1">
                  {navigation.map(
                    (
                      item
                    ) => {
                      const Icon =
                        item.icon;

                      const active =
                        item.name ===
                        "Dashboard";

                      return (
                        <Link
                          key={
                            item.name
                          }
                          href={
                            item.href
                          }
                          onClick={() =>
                            setMobileMenuOpen(
                              false
                            )
                          }
                          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold ${
                            active
                              ? "bg-lime-400 text-black"
                              : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                          }`}
                        >
                          <Icon
                            size={18}
                          />

                          {
                            item.name
                          }
                        </Link>
                      );
                    }
                  )}
                </nav>
              </div>
            </div>
          )}

          {/* ========================= */}
          {/* PAGE CONTENT */}
          {/* ========================= */}

          <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
            {/* ERROR */}
            {error && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            {/* PAGE TITLE */}
            <section className="mb-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-slate-950">
                    Overview
                  </h1>

                  <p className="mt-1 text-xs text-black">
                    Real-time kitchen performance for{" "}
                    {formatDate(
                      data?.date
                    )}
                  </p>
                </div>

                <div className="flex w-fit items-center gap-1 rounded-full border border-lime-300 bg-lime-100 px-3 py-2">
                  <span className="h-1 w-2 animate-pulse rounded-full bg-lime-500" />

                  <span className="text-xs font-black uppercase tracking-wider text-lime-800">
                    Sales Live
                  </span>
                </div>
              </div>
            </section>

            {/* RECORD SALE */}
            <section className="mb-4">
              <Link
                href="/admin/sales"
                className="group flex items-center justify-between rounded-2xl bg-lime-400 p-4 text-black shadow-lg transition hover:bg-lime-200"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-11 items-center justify-center rounded-xl bg-black text-lime-400">
                    <Plus
                      size={21}
                    />
                  </div>

                  <div>
                    <p className="font-black">
                      Record New Sale
                    </p>

                    <p className="text-xs font-semibold text-black/60">
                      Open the kitchen POS
                    </p>
                  </div>
                </div>

                <ChevronRight
                  className="transition group-hover:translate-x-1"
                />
              </Link>
            </section>

            {/* ========================= */}
            {/* SUMMARY */}
            {/* ========================= */}

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                title="Total Revenue"
                value={formatMoney(
                  summary.sales
                )}
                subtitle="Today's sales"
                icon={
                  <TrendingUp
                    size={22}
                  />
                }
              />

              <MetricCard
                title="Orders"
                value={String(
                  summary.orders
                )}
                subtitle="Confirmed orders"
                icon={
                  <Receipt
                    size={22}
                  />
                }
              />

              <MetricCard
                title="Items Sold"
                value={String(
                  summary.itemsSold
                )}
                subtitle="Products sold"
                icon={
                  <ShoppingBag
                    size={22}
                  />
                }
              />

              <MetricCard
                title="Average Order"
                value={formatMoney(
                  summary.averageOrder
                )}
                subtitle="Average basket"
                icon={
                  <BarChart3
                    size={22}
                  />
                }
              />
            </section>

            {/* ========================= */}
            {/* PRODUCT + PAYMENTS */}
            {/* ========================= */}

            <section className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
              {/* PRODUCT SALES */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-slate-950">
                      Product Sales
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Today's menu performance
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-100 text-lime-700">
                    <BarChart3
                      size={20}
                    />
                  </div>
                </div>

                {productBreakdown.length ===
                0 ? (
                  <EmptyState
                    title="No products sold yet"
                    subtitle="Products appear here after the first sale."
                  />
                ) : (
                  <div className="space-y-3">
                    {productBreakdown.map(
                      (
                        product,
                        index
                      ) => (
                        <div
                          key={
                            product.productId
                          }
                          className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sm font-black text-lime-700 shadow-sm">
                            {index + 1}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate font-bold text-slate-900">
                              {
                                product.productName
                              }
                            </p>

                            <p className="mt-1 text-xs font-semibold text-slate-500">
                              {
                                product.quantity
                              }{" "}
                              sold
                            </p>
                          </div>

                          <p className="shrink-0 font-black text-slate-950">
                            {formatMoney(
                              product.sales
                            )}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* PAYMENT BREAKDOWN */}
              <div className="rounded-2xl border border-zinc-800 bg-[#181818] p-5 shadow-sm sm:p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-black text-white">
                    Payment Breakdown
                  </h2>

                  <p className="mt-1 text-sm text-zinc-500">
                    How customers paid today
                  </p>
                </div>

                <div className="space-y-3">
                  <PaymentCard
                    title="Cash"
                    amount={
                      payments.cash
                    }
                    icon={
                      <Banknote
                        size={18}
                      />
                    }
                  />

                  <PaymentCard
                    title="EFT"
                    amount={
                      payments.eft
                    }
                    icon={
                      <CreditCard
                        size={18}
                      />
                    }
                  />

                  <PaymentCard
                    title="Website"
                    amount={
                      payments.website
                    }
                    icon={
                      <WalletCards
                        size={18}
                      />
                    }
                  />
                </div>

                <div className="mt-5 rounded-xl bg-lime-400 p-4 text-black">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider text-black/60">
                        Total
                      </p>

                      <p className="mt-1 text-sm font-bold">
                        Today's revenue
                      </p>
                    </div>

                    <p className="text-2xl font-black">
                      {formatMoney(
                        summary.sales
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* ========================= */}
            {/* RECENT SALES */}
            {/* ========================= */}

            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-950">
                    Recent Sales
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Latest transactions from the kitchen
                  </p>
                </div>

                <Link
                  href="/admin/history"
                  className="text-sm font-black text-lime-700 transition hover:text-lime-600"
                >
                  View History
                </Link>
              </div>

              {recentSales.length ===
              0 ? (
                <EmptyState
                  title="No sales recorded today"
                  subtitle="Record your first sale to start today's dashboard."
                />
              ) : (
                <div className="overflow-hidden rounded-xl border border-slate-200">
                  {recentSales.map(
                    (
                      sale,
                      index
                    ) => (
                      <div
                        key={
                          sale.id
                        }
                        className={`flex flex-col gap-4 bg-white p-4 sm:flex-row sm:items-center sm:justify-between ${
                          index !==
                          recentSales.length -
                            1
                            ? "border-b border-slate-100"
                            : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-lime-700">
                            <ShoppingCart
                              size={18}
                            />
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-black text-slate-950">
                                {formatMoney(
                                  sale.total
                                )}
                              </p>

                              <span className="rounded-full bg-lime-100 px-2.5 py-1 text-[11px] font-black uppercase text-lime-800">
                                {getPaymentLabel(
                                  sale.paymentMethod
                                )}
                              </span>
                            </div>

                            <p className="mt-1 max-w-2xl text-sm text-slate-500">
                              {sale.items
                                .map(
                                  (
                                    item
                                  ) =>
                                    `${item.quantity} × ${item.product_name}`
                                )
                                .join(
                                  ", "
                                )}
                            </p>
                          </div>
                        </div>

                        <p className="shrink-0 text-sm font-bold text-slate-400">
                          {formatTime(
                            sale.createdAt
                          )}
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}
            </section>

            {/* ========================= */}
            {/* MOBILE OPERATIONS */}
            {/* ========================= */}

            <section className="mt-6 lg:hidden">
              <h2 className="mb-3 text-lg font-black text-slate-950">
                Kitchen Operations
              </h2>

              <div className="grid grid-cols-2 gap-3">
                {navigation
                  .filter(
                    (item) =>
                      item.name !==
                      "Dashboard"
                  )
                  .map(
                    (
                      item
                    ) => {
                      const Icon =
                        item.icon;

                      return (
                        <Link
                          key={
                            item.name
                          }
                          href={
                            item.href
                          }
                          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-lime-300"
                        >
                          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-lime-700">
                            <Icon
                              size={19}
                            />
                          </div>

                          <p className="font-black text-slate-950">
                            {
                              item.name
                            }
                          </p>
                        </Link>
                      );
                    }
                  )}
              </div>
            </section>

            {/* FOOTER */}
            <footer className="mt-8 border-t border-slate-300 py-6">
              <div className="flex flex-col gap-2 text-xs font-semibold text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                <p>
                  GenZ Kitchen • Owner Dashboard
                </p>

                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-lime-500" />

                  Auto-refresh every 30 seconds
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ========================================= */
/* METRIC CARD */
/* ========================================= */

function MetricCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-6 flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-100 text-lime-700">
          {icon}
        </div>

        <div className="h-2 w-2 rounded-full bg-lime-400" />
      </div>

      <p className="text-sm font-bold text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">
        {value}
      </p>

      <p className="mt-2 text-xs font-semibold text-slate-400">
        {subtitle}
      </p>
    </div>
  );
}

/* ========================================= */
/* PAYMENT CARD */
/* ========================================= */

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
    <div className="flex items-center justify-between rounded-xl border border-zinc-700 bg-zinc-900 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-lime-400">
          {icon}
        </div>

        <div>
          <p className="text-sm font-bold text-white">
            {title}
          </p>

          <p className="text-xs text-zinc-500">
            Payment method
          </p>
        </div>
      </div>

      <p className="font-black text-white">
        R
        {Number(
          amount || 0
        ).toFixed(2)}
      </p>
    </div>
  );
}

/* ========================================= */
/* EMPTY STATE */
/* ========================================= */

function EmptyState({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
      <ShoppingBag className="mx-auto mb-3 text-slate-300" />

      <p className="font-black text-slate-700">
        {title}
      </p>

      <p className="mt-1 text-sm text-slate-400">
        {subtitle}
      </p>
    </div>
  );
}