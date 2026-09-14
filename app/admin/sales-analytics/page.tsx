"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import Link from "next/link";

import {
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  ChefHat,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  History,
  LayoutDashboard,
  Menu,
  Package,
  RefreshCw,
  Receipt,
  ShoppingCart,
  Target,
  TrendingUp,
  Trophy,
  X,
} from "lucide-react";

/* ============================================================
   TYPES
============================================================ */

type WeekDay = {
  date: string;
  day: string;
  shortDay: string;
  sales: number;
  orders: number;
  isToday: boolean;
};

type SalesOverviewResponse = {
  success: boolean;

  currentYear: number;

  today: string;

  weekStart: string;

  weekEnd: string;

  summary: {
    weeklySales: number;
    weeklyOrders: number;
    averageOrder: number;
    yearToDate: number;
    yearOrders: number;
    highestSales: number;
    bestDay: string | null;
  };

  week: WeekDay[];
};

/* ============================================================
   NAVIGATION
============================================================ */

const navigation = [
  {
    name: "Dashboard",
    href: "/admin/kitchen",
    icon: LayoutDashboard,
  },

  {
    name: "Make a Sale",
    href: "/admin/sales",
    icon: ShoppingCart,
  },

  {
    name: "Sales Analyst",
    href: "/admin/sales-analytics",
    icon: BarChart3,
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

/* ============================================================
   PAGE
============================================================ */

export default function SalesAnalyticsPage() {
  const [data, setData] =
    useState<SalesOverviewResponse | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  /* ============================================================
     LOAD SALES
  ============================================================ */

  const loadSales = useCallback(
    async (manual = false) => {
      try {
        if (manual) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const response =
          await fetch(
            "/api/kitchen/sales-overview",
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
              "Failed to load sales analytics."
          );
        }

        setData(result);
      } catch (err) {
        console.error(
          "Sales analytics error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load sales analytics."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  /* ============================================================
     AUTO REFRESH
  ============================================================ */

  useEffect(() => {
    loadSales();

    const interval =
      setInterval(() => {
        loadSales(true);
      }, 30000);

    return () =>
      clearInterval(interval);
  }, [loadSales]);

  /* ============================================================
     HELPERS
  ============================================================ */

  function money(
    amount: number
  ) {
    return `R${Number(
      amount || 0
    ).toLocaleString(
      "en-ZA",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  }

  function shortMoney(
    amount: number
  ) {
    if (amount >= 1_000_000) {
      return `R${(
        amount / 1_000_000
      ).toFixed(1)}m`;
    }

    if (amount >= 1000) {
      return `R${(
        amount / 1000
      ).toFixed(1)}k`;
    }

    return `R${Math.round(
      amount
    )}`;
  }

  function formatDate(
    date: string
  ) {
    return new Intl.DateTimeFormat(
      "en-ZA",
      {
        timeZone:
          "Africa/Johannesburg",

        day: "numeric",

        month: "short",

        year: "numeric",
      }
    ).format(
      new Date(
        `${date}T12:00:00+02:00`
      )
    );
  }

  function formatShortDate(
    date: string
  ) {
    return new Intl.DateTimeFormat(
      "en-ZA",
      {
        timeZone:
          "Africa/Johannesburg",

        day: "numeric",

        month: "short",
      }
    ).format(
      new Date(
        `${date}T12:00:00+02:00`
      )
    );
  }

  /* ============================================================
     DERIVED DATA
  ============================================================ */

  const week =
    data?.week || [];

  const summary =
    data?.summary || {
      weeklySales: 0,
      weeklyOrders: 0,
      averageOrder: 0,
      yearToDate: 0,
      yearOrders: 0,
      highestSales: 0,
      bestDay: null,
    };

  const maximumSales =
    useMemo(() => {
      return Math.max(
        ...week.map(
          (day) => day.sales
        ),
        1
      );
    }, [week]);

  const weeklyAveragePerDay =
    useMemo(() => {
      if (!week.length) {
        return 0;
      }

      return (
        summary.weeklySales /
        week.length
      );
    }, [
      summary.weeklySales,
      week.length,
    ]);

  const tradingDays =
    useMemo(() => {
      return week.filter(
        (day) =>
          day.orders > 0
      ).length;
    }, [week]);

  const averagePerTradingDay =
    tradingDays > 0
      ? summary.weeklySales /
        tradingDays
      : 0;

  /* ============================================================
     LOADING
  ============================================================ */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#eef0f2]">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
            <RefreshCw className="h-6 w-6 animate-spin text-lime-600" />
          </div>

          <p className="font-black text-slate-900">
            Loading sales
            analytics...
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Reading your latest
            sales data.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#eef0f2] text-slate-950">
      <div className="flex min-h-screen">

        {/* ====================================================
            DESKTOP SIDEBAR
        ==================================================== */}

        <aside className="hidden w-[240px] shrink-0 border-r border-zinc-800 bg-[#151515] lg:flex lg:flex-col">

          {/* LOGO */}

          <div className="flex h-20 items-center border-b border-zinc-800 px-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400 text-black">
                <ChefHat
                  size={22}
                />
              </div>

              <div>

                <p className="text-lg font-black text-white">
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
                  "Sales Analyst";

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

          {/* YEAR CARD */}

          <div className="p-4">

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">

              <div className="flex items-center justify-between">

                <p className="text-xs font-black uppercase tracking-wider text-lime-400">
                  {data?.currentYear}
                </p>

                <TrendingUp
                  size={16}
                  className="text-lime-400"
                />

              </div>

              <p className="mt-3 text-xl font-black text-white">
                {money(
                  summary.yearToDate
                )}
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Year-to-date sales
              </p>

              <div className="mt-4 border-t border-zinc-800 pt-3">

                <p className="text-xs font-semibold text-zinc-500">
                  {
                    summary.yearOrders
                  }{" "}
                  orders recorded
                </p>

              </div>

            </div>

          </div>

        </aside>

        {/* ====================================================
            MAIN CONTENT
        ==================================================== */}

        <div className="min-w-0 flex-1">

          {/* ==================================================
              TOP NAV
          ================================================== */}

          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">

            <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">

              <div className="flex items-center gap-3">

                {/* MOBILE BUTTON */}

                <button
                  type="button"
                  onClick={() =>
                    setMobileMenuOpen(
                      true
                    )
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 lg:hidden"
                  aria-label="Open menu"
                >
                  <Menu
                    size={20}
                  />
                </button>

                {/* MOBILE LOGO */}

                <div className="flex items-center gap-2 lg:hidden">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-400 text-black">
                    <ChefHat
                      size={20}
                    />
                  </div>

                  <div>
                    <p className="text-sm font-black">
                      GenZKitchen
                    </p>

                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Analytics
                    </p>
                  </div>

                </div>

                {/* DESKTOP TITLE */}

                <div className="hidden lg:block">

                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    GenZ Kitchen
                  </p>

                  <p className="font-black">
                    Sales Analytics
                  </p>

                </div>

              </div>

              {/* TOP ACTIONS */}

              <div className="flex items-center gap-2">

                <button
                  type="button"
                  onClick={() =>
                    loadSales(true)
                  }
                  disabled={
                    refreshing
                  }
                  className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-3 text-sm font-black text-slate-700 transition hover:bg-slate-200 disabled:opacity-60"
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
                  href="/admin/sales"
                  className="flex h-10 items-center gap-2 rounded-xl bg-lime-400 px-4 text-sm font-black text-black transition hover:bg-lime-300"
                >

                  <ShoppingCart
                    size={17}
                  />

                  <span className="hidden sm:inline">
                    Make a Sale
                  </span>

                </Link>

              </div>

            </div>

          </header>

          {/* ==================================================
              MOBILE MENU
          ================================================== */}

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
                className="absolute inset-0 bg-black/60"
              />

              <div className="relative h-full w-[285px] bg-[#151515] p-4 shadow-2xl">

                <div className="mb-6 flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400 text-black">
                      <ChefHat
                        size={21}
                      />
                    </div>

                    <div>

                      <p className="font-black text-white">
                        GenZKitchen
                      </p>

                      <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">
                        Owner Dashboard
                      </p>

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setMobileMenuOpen(
                        false
                      )
                    }
                    className="rounded-xl bg-zinc-900 p-2 text-white"
                  >
                    <X
                      size={18}
                    />
                  </button>

                </div>

                <nav className="space-y-1">

                  {navigation.map(
                    (item) => {
                      const Icon =
                        item.icon;

                      const active =
                        item.name ===
                        "Sales Analyst";

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

          {/* ==================================================
              PAGE CONTENT
          ================================================== */}

          <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">

            {/* ERROR */}

            {error && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">

                <p className="font-black text-red-700">
                  Sales analytics
                  unavailable
                </p>

                <p className="mt-1 text-sm text-red-600">
                  {error}
                </p>

              </div>
            )}

            {/* ==================================================
                PAGE TITLE
            ================================================== */}

            <section className="mb-6">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                <div>

                  <div className="flex items-center gap-2 text-lime-700">

                    <BarChart3
                      size={17}
                    />

                    <p className="text-xs font-black uppercase tracking-[0.18em]">
                      Sales Analyst
                    </p>

                  </div>

                  <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                    Sales Performance
                  </h1>

                  <p className="mt-2 max-w-xl text-sm text-slate-500">
                    Track weekly
                    revenue, orders
                    and your strongest
                    trading days.
                  </p>

                </div>

                {/* CURRENT WEEK */}

                {data && (
                  <div className="flex w-fit items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-100 text-lime-700">
                      <CalendarDays
                        size={19}
                      />
                    </div>

                    <div>

                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        Current Week
                      </p>

                      <p className="mt-0.5 text-sm font-black text-slate-800">
                        {formatShortDate(
                          data.weekStart
                        )}
                        {" – "}
                        {formatDate(
                          data.weekEnd
                        )}
                      </p>

                    </div>

                  </div>
                )}

              </div>

            </section>

            {/* ==================================================
                MAIN METRICS
            ================================================== */}

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <MetricCard
                title="This Week"
                value={money(
                  summary.weeklySales
                )}
                subtitle={`${summary.weeklyOrders} orders`}
                icon={
                  <TrendingUp
                    size={21}
                  />
                }
              />

              <MetricCard
                title="Average Order"
                value={money(
                  summary.averageOrder
                )}
                subtitle="Average customer spend"
                icon={
                  <Target
                    size={21}
                  />
                }
              />

              <MetricCard
                title="Best Day"
                value={
                  summary.bestDay ||
                  "No sales"
                }
                subtitle={
                  summary.bestDay
                    ? money(
                        summary.highestSales
                      )
                    : "No sales recorded"
                }
                icon={
                  <Trophy
                    size={21}
                  />
                }
                featured
              />

              <MetricCard
                title={`${data?.currentYear || ""} YTD`}
                value={money(
                  summary.yearToDate
                )}
                subtitle={`${summary.yearOrders} orders this year`}
                icon={
                  <ArrowUpRight
                    size={21}
                  />
                }
              />

            </section>

            {/* ==================================================
                WEEKLY SALES GRAPH
            ================================================== */}

            <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

              {/* GRAPH HEADER */}

              <div className="border-b border-slate-100 p-5 sm:p-7">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <p className="text-xs font-black uppercase tracking-[0.18em] text-lime-700">
                      Weekly Revenue
                    </p>

                    <h2 className="mt-1 text-2xl font-black">
                      Sunday to Saturday
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Higher bars show
                      stronger sales
                      performance.
                    </p>

                  </div>

                  {summary.bestDay && (
                    <div className="rounded-2xl border border-lime-200 bg-lime-50 px-4 py-3">

                      <div className="flex items-center gap-2">

                        <Trophy
                          size={16}
                          className="text-lime-700"
                        />

                        <p className="text-[10px] font-black uppercase tracking-wider text-lime-700">
                          Highest Day
                        </p>

                      </div>

                      <p className="mt-1 font-black text-slate-950">
                        {
                          summary.bestDay
                        }{" "}
                        •{" "}
                        {money(
                          summary.highestSales
                        )}
                      </p>

                    </div>
                  )}

                </div>

              </div>

              {/* GRAPH AREA */}

              <div className="overflow-x-auto p-4 sm:p-7">

                <div className="min-w-[650px]">

                  {/* Y AXIS GUIDE */}

                  <div className="flex">

                    <div className="mr-3 flex h-[290px] w-14 flex-col justify-between pb-[2px] text-right">

                      <span className="text-[10px] font-bold text-slate-400">
                        {shortMoney(
                          maximumSales
                        )}
                      </span>

                      <span className="text-[10px] font-bold text-slate-400">
                        {shortMoney(
                          maximumSales *
                            0.75
                        )}
                      </span>

                      <span className="text-[10px] font-bold text-slate-400">
                        {shortMoney(
                          maximumSales *
                            0.5
                        )}
                      </span>

                      <span className="text-[10px] font-bold text-slate-400">
                        {shortMoney(
                          maximumSales *
                            0.25
                        )}
                      </span>

                      <span className="text-[10px] font-bold text-slate-400">
                        R0
                      </span>

                    </div>

                    {/* BARS */}

                    <div className="relative flex h-[290px] flex-1 items-end">

                      {/* GRID */}

                      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">

                        {[
                          1,
                          2,
                          3,
                          4,
                          5,
                        ].map(
                          (line) => (
                            <div
                              key={
                                line
                              }
                              className="border-t border-dashed border-slate-200"
                            />
                          )
                        )}

                      </div>

                      <div className="relative z-10 flex h-full w-full items-end gap-3">

                        {week.map(
                          (day) => {
                            const percent =
                              maximumSales >
                              0
                                ? (day.sales /
                                    maximumSales) *
                                  100
                                : 0;

                            const highest =
                              day.sales >
                                0 &&
                              day.sales ===
                                summary.highestSales;

                            return (
                              <div
                                key={
                                  day.date
                                }
                                className="group flex h-full min-w-0 flex-1 flex-col justify-end"
                              >

                                {/* VALUE */}

                                <div className="mb-2 text-center">

                                  <p
                                    className={`text-xs font-black ${
                                      highest
                                        ? "text-lime-700"
                                        : "text-slate-600"
                                    }`}
                                  >
                                    {day.sales >
                                    0
                                      ? shortMoney(
                                          day.sales
                                        )
                                      : "R0"}
                                  </p>

                                </div>

                                {/* BAR */}

                                <div className="relative flex h-[220px] items-end justify-center">

                                  <div
                                    className={`relative w-[68%] min-w-[26px] max-w-[58px] rounded-t-xl transition-all duration-500 ${
                                      highest
                                        ? "bg-lime-400 shadow-[0_0_30px_rgba(163,230,53,0.35)]"
                                        : day.isToday
                                          ? "bg-slate-900"
                                          : "bg-slate-300 group-hover:bg-slate-400"
                                    }`}
                                    style={{
                                      height:
                                        day.sales >
                                        0
                                          ? `${Math.max(
                                              percent,
                                              6
                                            )}%`
                                          : "3px",
                                    }}
                                  >

                                    {/* HIGHEST MARKER */}

                                    {highest && (
                                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">

                                        <div className="h-3 w-3 rounded-full bg-lime-600 ring-4 ring-lime-100" />

                                      </div>
                                    )}

                                  </div>

                                </div>

                                {/* DAY */}

                                <div className="mt-3 text-center">

                                  <p
                                    className={`text-sm font-black ${
                                      day.isToday
                                        ? "text-lime-700"
                                        : "text-slate-700"
                                    }`}
                                  >
                                    {
                                      day.shortDay
                                    }
                                  </p>

                                  <p className="mt-1 text-[10px] font-semibold text-slate-400">
                                    {
                                      day.orders
                                    }{" "}
                                    order
                                    {day.orders ===
                                    1
                                      ? ""
                                      : "s"}
                                  </p>

                                  {day.isToday && (
                                    <span className="mt-2 inline-flex rounded-full bg-slate-950 px-2 py-1 text-[8px] font-black uppercase tracking-wide text-white">
                                      Today
                                    </span>
                                  )}

                                </div>

                              </div>
                            );
                          }
                        )}

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </section>

            {/* ==================================================
                EXTRA ANALYTICS
            ================================================== */}

            <section className="mt-6 grid gap-4 md:grid-cols-3">

              <MiniStat
                title="Trading Days"
                value={`${tradingDays}`}
                subtitle="Days with at least one order"
              />

              <MiniStat
                title="Avg / Trading Day"
                value={money(
                  averagePerTradingDay
                )}
                subtitle="Revenue per active day"
              />

              <MiniStat
                title="7-Day Average"
                value={money(
                  weeklyAveragePerDay
                )}
                subtitle="Average across the full week"
              />

            </section>

            {/* ==================================================
                DAILY BREAKDOWN
            ================================================== */}

            <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

              <div className="mb-6 flex items-center justify-between">

                <div>

                  <p className="text-xs font-black uppercase tracking-[0.18em] text-lime-700">
                    Breakdown
                  </p>

                  <h2 className="mt-1 text-xl font-black">
                    Daily Sales
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Sales and order
                    totals for every
                    day this week.
                  </p>

                </div>

              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

                {week.map(
                  (day) => {
                    const highest =
                      day.sales > 0 &&
                      day.sales ===
                        summary.highestSales;

                    return (
                      <div
                        key={
                          day.date
                        }
                        className={`rounded-2xl border p-4 transition ${
                          highest
                            ? "border-lime-300 bg-lime-50"
                            : day.isToday
                              ? "border-slate-300 bg-slate-100"
                              : "border-slate-200 bg-slate-50"
                        }`}
                      >

                        <div className="flex items-start justify-between gap-3">

                          <div>

                            <div className="flex flex-wrap items-center gap-2">

                              <p className="font-black">
                                {
                                  day.day
                                }
                              </p>

                              {day.isToday && (
                                <span className="rounded-full bg-slate-950 px-2 py-1 text-[8px] font-black uppercase tracking-wide text-white">
                                  Today
                                </span>
                              )}

                            </div>

                            <p className="mt-1 text-xs font-semibold text-slate-400">
                              {formatShortDate(
                                day.date
                              )}
                            </p>

                          </div>

                          {highest && (
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-lime-400 text-black">

                              <Trophy
                                size={15}
                              />

                            </div>
                          )}

                        </div>

                        <div className="mt-5">

                          <p
                            className={`text-2xl font-black ${
                              highest
                                ? "text-lime-700"
                                : "text-slate-950"
                            }`}
                          >
                            {money(
                              day.sales
                            )}
                          </p>

                          <p className="mt-1 text-xs font-semibold text-slate-500">
                            {
                              day.orders
                            }{" "}
                            order
                            {day.orders ===
                            1
                              ? ""
                              : "s"}
                          </p>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            </section>

            {/* ==================================================
                YEAR PERFORMANCE CARD
            ================================================== */}

            <section className="mt-6 rounded-3xl border border-zinc-800 bg-[#181818] p-5 text-white shadow-sm sm:p-7">

              <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">

                <div>

                  <div className="flex items-center gap-2">

                    <TrendingUp
                      size={18}
                      className="text-lime-400"
                    />

                    <p className="text-xs font-black uppercase tracking-[0.18em] text-lime-400">
                      {
                        data?.currentYear
                      }{" "}
                      Performance
                    </p>

                  </div>

                  <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                    {money(
                      summary.yearToDate
                    )}
                  </h2>

                  <p className="mt-2 text-sm text-zinc-500">
                    Total sales
                    recorded during{" "}
                    {
                      data?.currentYear
                    }{" "}
                    so far.
                  </p>

                </div>

                <div className="grid grid-cols-2 gap-3">

                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">

                    <p className="text-xs font-bold text-zinc-500">
                      Orders
                    </p>

                    <p className="mt-1 text-xl font-black text-white">
                      {
                        summary.yearOrders
                      }
                    </p>

                  </div>

                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">

                    <p className="text-xs font-bold text-zinc-500">
                      Current Week
                    </p>

                    <p className="mt-1 text-xl font-black text-lime-400">
                      {money(
                        summary.weeklySales
                      )}
                    </p>

                  </div>

                </div>

              </div>

            </section>

            {/* ==================================================
                POS SHORTCUT
            ================================================== */}

            <section className="mt-6">

              <Link
                href="/admin/sales"
                className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-lime-300"
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime-400 text-black">

                    <ShoppingCart
                      size={21}
                    />

                  </div>

                  <div>

                    <p className="font-black">
                      Make a Sale
                    </p>

                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      Open the GenZ
                      Kitchen POS.
                    </p>

                  </div>

                </div>

                <ChevronRight className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-lime-700" />

              </Link>

            </section>

          </div>

        </div>

      </div>
    </main>
  );
}

/* ============================================================
   METRIC CARD
============================================================ */

function MetricCard({
  title,
  value,
  subtitle,
  icon,
  featured = false,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
  featured?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm ${
        featured
          ? "border-lime-300 bg-lime-50"
          : "border-slate-200 bg-white"
      }`}
    >

      <div className="flex items-start justify-between">

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${
            featured
              ? "bg-lime-400 text-black"
              : "bg-lime-100 text-lime-700"
          }`}
        >
          {icon}
        </div>

        <span
          className={`h-2.5 w-2.5 rounded-full ${
            featured
              ? "bg-lime-600"
              : "bg-lime-400"
          }`}
        />

      </div>

      <p className="mt-5 text-sm font-bold text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-black tracking-tight text-slate-950">
        {value}
      </p>

      <p className="mt-2 text-xs font-semibold text-slate-400">
        {subtitle}
      </p>

    </div>
  );
}

/* ============================================================
   MINI STAT
============================================================ */

function MiniStat({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <p className="text-xs font-black uppercase tracking-wider text-slate-400">
        {title}
      </p>

      <p className="mt-2 text-2xl font-black text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-xs font-semibold text-slate-500">
        {subtitle}
      </p>

    </div>
  );
}