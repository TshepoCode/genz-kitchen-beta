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
  PieChart,
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

type MonthDay = {
  date: string;
  day: number;
  sales: number;
  orders: number;
  isToday: boolean;
};

type YearMonth = {
  month: string;
  shortMonth: string;
  monthNumber: number;
  sales: number;
  orders: number;
};

type SalesOverviewResponse = {
  success: boolean;

  currentYear: number;
  currentMonth: number;
  currentMonthName: string;

  today: string;

  weekStart: string;
  weekEnd: string;

  summary: {
    weeklySales: number;
    weeklyOrders: number;

    monthlySales: number;
    monthlyOrders: number;

    averageOrder: number;

    yearToDate: number;
    yearOrders: number;

    highestSales: number;
    bestDay: string | null;

    bestMonth: string | null;
    bestMonthSales: number;
  };

  week: WeekDay[];

  month: MonthDay[];

  year: YearMonth[];
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
    href: "/admin/kitchen/start-day",
    icon: ClipboardCheck,
  },
  {
    name: "Stock",
    href: "/admin/kitchen/stock",
    icon: Package,
  },
  {
    name: "Expenses",
    href: "/admin/kitchen/expenses",
    icon: CircleDollarSign,
  },
  {
    name: "End Day",
    href: "/admin/kitchen/end-day",
    icon: Receipt,
  },
  {
    name: "History",
    href: "/admin/history",
    icon: History,
  },
];

/* ============================================================
   PIE CHART COLORS
============================================================ */

const PIE_COLORS = [
  "#a3e635",
  "#18181b",
  "#65a30d",
  "#d9f99d",
  "#3f6212",
  "#84cc16",
  "#52525b",
  "#bef264",
  "#27272a",
  "#4d7c0f",
  "#71717a",
  "#ecfccb",
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
            "/api/kitchen/analytics",
            {
              method: "GET",
              cache: "no-store",
            }
          );

        const contentType =
          response.headers.get(
            "content-type"
          );

        if (
          !contentType?.includes(
            "application/json"
          )
        ) {
          const text =
            await response.text();

          console.error(
            "Analytics returned non-JSON:",
            text
          );

          throw new Error(
            `Analytics API returned ${response.status}.`
          );
        }

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

  function safeDate(
    date?: string
  ) {
    if (!date) {
      return null;
    }

    const parsed =
      new Date(
        `${date}T12:00:00+02:00`
      );

    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {
      return null;
    }

    return parsed;
  }

  function formatDate(
    date?: string
  ) {
    const parsed =
      safeDate(date);

    if (!parsed) {
      return "—";
    }

    return new Intl.DateTimeFormat(
      "en-ZA",
      {
        timeZone:
          "Africa/Johannesburg",
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    ).format(parsed);
  }

  function formatShortDate(
    date?: string
  ) {
    const parsed =
      safeDate(date);

    if (!parsed) {
      return "—";
    }

    return new Intl.DateTimeFormat(
      "en-ZA",
      {
        timeZone:
          "Africa/Johannesburg",
        day: "numeric",
        month: "short",
      }
    ).format(parsed);
  }

  /* ============================================================
     DERIVED DATA
  ============================================================ */

  const week =
    data?.week || [];

  const month =
    data?.month || [];

  const year =
    data?.year || [];

  const summary =
    data?.summary || {
      weeklySales: 0,
      weeklyOrders: 0,

      monthlySales: 0,
      monthlyOrders: 0,

      averageOrder: 0,

      yearToDate: 0,
      yearOrders: 0,

      highestSales: 0,
      bestDay: null,

      bestMonth: null,
      bestMonthSales: 0,
    };

  /* WEEK */

  const maximumSales =
    useMemo(() => {
      return Math.max(
        ...week.map(
          (day) =>
            day.sales
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

  /* MONTH */

  const maximumMonthSales =
    useMemo(() => {
      return Math.max(
        ...month.map(
          (day) =>
            day.sales
        ),
        1
      );
    }, [month]);

  const monthlyTradingDays =
    useMemo(() => {
      return month.filter(
        (day) =>
          day.orders > 0
      ).length;
    }, [month]);

  const monthlyAverage =
    monthlyTradingDays > 0
      ? summary.monthlySales /
        monthlyTradingDays
      : 0;

  /* YEAR */

  const activeYearMonths =
    useMemo(() => {
      return year.filter(
        (item) =>
          item.sales > 0
      );
    }, [year]);

  const averageMonthlyRevenue =
    activeYearMonths.length >
    0
      ? summary.yearToDate /
        activeYearMonths.length
      : 0;

  /* ============================================================
     PIE CHART
  ============================================================ */

  const pieGradient =
    useMemo(() => {
      if (
        activeYearMonths.length ===
        0
      ) {
        return "";
      }

      let running = 0;

      const segments =
        activeYearMonths.map(
          (item, index) => {
            const percentage =
              summary.yearToDate >
              0
                ? (item.sales /
                    summary.yearToDate) *
                  100
                : 0;

            const start =
              running;

            const end =
              running +
              percentage;

            running = end;

            return `${
              PIE_COLORS[
                index %
                  PIE_COLORS.length
              ]
            } ${start}% ${end}%`;
          }
        );

      return `conic-gradient(${segments.join(
        ", "
      )})`;
    }, [
      activeYearMonths,
      summary.yearToDate,
    ]);

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
            Loading sales analytics...
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
            MAIN
        ==================================================== */}

        <div className="min-w-0 flex-1">

          {/* TOP NAV */}

          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">

            <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">

              <div className="flex items-center gap-3">

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

                <div className="hidden lg:block">

                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    GenZ Kitchen
                  </p>

                  <p className="font-black">
                    Sales Analytics
                  </p>

                </div>

              </div>

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

            {error && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">

                <p className="font-black text-red-700">
                  Sales analytics unavailable
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
                    Weekly, monthly and yearly
                    performance for GenZ Kitchen.
                  </p>

                </div>

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

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

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
                title="This Month"
                value={money(
                  summary.monthlySales
                )}
                subtitle={`${summary.monthlyOrders} orders`}
                icon={
                  <CalendarDays
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
                subtitle={`${summary.yearOrders} orders`}
                icon={
                  <ArrowUpRight
                    size={21}
                  />
                }
              />

            </section>

            {/* ==================================================
                WEEKLY GRAPH
            ================================================== */}

            <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

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
                      Daily sales performance
                      for the current week.
                    </p>

                  </div>

                  {summary.bestDay && (
                    <div className="rounded-2xl border border-lime-200 bg-lime-50 px-4 py-3">

                      <p className="text-[10px] font-black uppercase tracking-wider text-lime-700">
                        Highest Day
                      </p>

                      <p className="mt-1 font-black">
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

              <div className="overflow-x-auto p-4 sm:p-7">

                <div className="min-w-[650px]">

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

                    <div className="relative flex h-[290px] flex-1 items-end">

                      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">

                        {[1, 2, 3, 4, 5].map(
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

                                <div className="mb-2 text-center">

                                  <p className="text-xs font-black text-slate-600">
                                    {day.sales >
                                    0
                                      ? shortMoney(
                                          day.sales
                                        )
                                      : "R0"}
                                  </p>

                                </div>

                                <div className="relative flex h-[220px] items-end justify-center">

                                  <div
                                    className={`relative w-[68%] min-w-[26px] max-w-[58px] rounded-t-xl transition-all ${
                                      highest
                                        ? "bg-lime-400"
                                        : day.isToday
                                          ? "bg-slate-950"
                                          : "bg-slate-300"
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
                                  />

                                </div>

                                <div className="mt-3 text-center">

                                  <p className="text-sm font-black">
                                    {
                                      day.shortDay
                                    }
                                  </p>

                                  <p className="mt-1 text-[10px] font-semibold text-slate-400">
                                    {
                                      day.orders
                                    }{" "}
                                    orders
                                  </p>

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
                MONTHLY HISTOGRAM
            ================================================== */}

            <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-100 p-5 sm:p-7">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <div className="flex items-center gap-2 text-lime-700">

                      <BarChart3
                        size={17}
                      />

                      <p className="text-xs font-black uppercase tracking-[0.18em]">
                        Monthly Overview
                      </p>

                    </div>

                    <h2 className="mt-2 text-2xl font-black">
                      {
                        data?.currentMonthName
                      }{" "}
                      {
                        data?.currentYear
                      }
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Daily revenue across
                      the current month.
                    </p>

                  </div>

                  <div className="grid grid-cols-2 gap-2">

                    <div className="rounded-xl bg-slate-100 px-4 py-3">

                      <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                        Revenue
                      </p>

                      <p className="mt-1 font-black">
                        {money(
                          summary.monthlySales
                        )}
                      </p>

                    </div>

                    <div className="rounded-xl bg-lime-100 px-4 py-3">

                      <p className="text-[9px] font-black uppercase tracking-wider text-lime-700">
                        Orders
                      </p>

                      <p className="mt-1 font-black">
                        {
                          summary.monthlyOrders
                        }
                      </p>

                    </div>

                  </div>

                </div>

              </div>

              <div className="overflow-x-auto p-5 sm:p-7">

                <div className="min-w-[1000px]">

                  <div className="flex">

                    <div className="mr-3 flex h-[310px] w-14 flex-col justify-between pb-7 text-right">

                      <span className="text-[10px] font-bold text-slate-400">
                        {shortMoney(
                          maximumMonthSales
                        )}
                      </span>

                      <span className="text-[10px] font-bold text-slate-400">
                        {shortMoney(
                          maximumMonthSales *
                            0.75
                        )}
                      </span>

                      <span className="text-[10px] font-bold text-slate-400">
                        {shortMoney(
                          maximumMonthSales *
                            0.5
                        )}
                      </span>

                      <span className="text-[10px] font-bold text-slate-400">
                        {shortMoney(
                          maximumMonthSales *
                            0.25
                        )}
                      </span>

                      <span className="text-[10px] font-bold text-slate-400">
                        R0
                      </span>

                    </div>

                    <div className="relative flex h-[310px] flex-1 items-end">

                      <div className="pointer-events-none absolute inset-x-0 top-0 bottom-7 flex flex-col justify-between">

                        {[1, 2, 3, 4, 5].map(
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

                      <div className="relative z-10 flex h-full w-full items-end gap-1">

                        {month.map(
                          (day) => {
                            const percentage =
                              maximumMonthSales >
                              0
                                ? (day.sales /
                                    maximumMonthSales) *
                                  100
                                : 0;

                            return (
                              <div
                                key={
                                  day.date
                                }
                                className="group flex h-full min-w-[24px] flex-1 flex-col justify-end"
                              >

                                <div className="relative flex h-[260px] items-end justify-center">

                                  <div
                                    title={`${formatShortDate(
                                      day.date
                                    )}: ${money(
                                      day.sales
                                    )}`}
                                    className={`w-[70%] min-w-[8px] max-w-[24px] rounded-t-md transition ${
                                      day.isToday
                                        ? "bg-lime-400"
                                        : day.sales >
                                            0
                                          ? "bg-slate-900"
                                          : "bg-slate-200"
                                    }`}
                                    style={{
                                      height:
                                        day.sales >
                                        0
                                          ? `${Math.max(
                                              percentage,
                                              4
                                            )}%`
                                          : "2px",
                                    }}
                                  />

                                </div>

                                <div className="mt-2 text-center">

                                  <p
                                    className={`text-[9px] font-black ${
                                      day.isToday
                                        ? "text-lime-700"
                                        : "text-slate-400"
                                    }`}
                                  >
                                    {
                                      day.day
                                    }
                                  </p>

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
                MONTH STATS
            ================================================== */}

            <section className="mt-6 grid gap-4 md:grid-cols-3">

              <MiniStat
                title="Monthly Revenue"
                value={money(
                  summary.monthlySales
                )}
                subtitle={`${summary.monthlyOrders} orders this month`}
              />

              <MiniStat
                title="Monthly Trading Days"
                value={`${monthlyTradingDays}`}
                subtitle="Days with recorded sales"
              />

              <MiniStat
                title="Avg / Trading Day"
                value={money(
                  monthlyAverage
                )}
                subtitle="Average monthly trading-day revenue"
              />

            </section>

            {/* ==================================================
                YEARLY PIE CHART
            ================================================== */}

            <section className="mt-6 rounded-3xl border border-zinc-800 bg-[#181818] p-5 text-white shadow-sm sm:p-7">

              <div className="flex flex-col gap-2">

                <div className="flex items-center gap-2">

                  <PieChart
                    size={18}
                    className="text-lime-400"
                  />

                  <p className="text-xs font-black uppercase tracking-[0.18em] text-lime-400">
                    Yearly Tracker
                  </p>

                </div>

                <h2 className="text-2xl font-black">
                  {
                    data?.currentYear
                  }{" "}
                  Revenue Distribution
                </h2>

                <p className="text-sm text-zinc-500">
                  See which months contribute
                  the most to annual revenue.
                </p>

              </div>

              <div className="mt-8 grid gap-8 xl:grid-cols-[380px_1fr] xl:items-center">

                {/* PIE */}

                <div className="flex justify-center">

                  <div className="relative">

                    {activeYearMonths.length >
                    0 ? (
                      <div
                        className="relative h-[280px] w-[280px] rounded-full"
                        style={{
                          background:
                            pieGradient,
                        }}
                      >

                        <div className="absolute inset-[62px] flex flex-col items-center justify-center rounded-full border border-zinc-800 bg-[#181818]">

                          <p className="text-[10px] font-black uppercase tracking-wider text-zinc-500">
                            Year Total
                          </p>

                          <p className="mt-2 text-2xl font-black text-white">
                            {shortMoney(
                              summary.yearToDate
                            )}
                          </p>

                          <p className="mt-1 text-xs font-semibold text-zinc-500">
                            {
                              summary.yearOrders
                            }{" "}
                            orders
                          </p>

                        </div>

                      </div>
                    ) : (
                      <div className="flex h-[280px] w-[280px] items-center justify-center rounded-full border-[50px] border-zinc-800">

                        <div className="text-center">

                          <p className="text-xl font-black">
                            R0
                          </p>

                          <p className="mt-1 text-xs text-zinc-500">
                            No sales yet
                          </p>

                        </div>

                      </div>
                    )}

                  </div>

                </div>

                {/* MONTH LIST */}

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                  {year.map(
                    (
                      item,
                      index
                    ) => {
                      const percentage =
                        summary.yearToDate >
                        0
                          ? (item.sales /
                              summary.yearToDate) *
                            100
                          : 0;

                      return (
                        <div
                          key={
                            item.month
                          }
                          className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4"
                        >

                          <div className="flex items-center justify-between">

                            <div className="flex items-center gap-2">

                              <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{
                                  background:
                                    PIE_COLORS[
                                      index %
                                        PIE_COLORS.length
                                    ],
                                }}
                              />

                              <p className="font-black">
                                {
                                  item.shortMonth
                                }
                              </p>

                            </div>

                            <span className="text-xs font-black text-zinc-500">
                              {percentage.toFixed(
                                1
                              )}
                              %
                            </span>

                          </div>

                          <p className="mt-3 text-lg font-black text-white">
                            {money(
                              item.sales
                            )}
                          </p>

                          <p className="mt-1 text-[10px] font-semibold text-zinc-500">
                            {
                              item.orders
                            }{" "}
                            orders
                          </p>

                        </div>
                      );
                    }
                  )}

                </div>

              </div>

            </section>

            {/* ==================================================
                YEAR PERFORMANCE
            ================================================== */}

            <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

              <MiniStat
                title={`${data?.currentYear || ""} Revenue`}
                value={money(
                  summary.yearToDate
                )}
                subtitle="Total recorded revenue"
              />

              <MiniStat
                title="Year Orders"
                value={`${summary.yearOrders}`}
                subtitle="Orders recorded this year"
              />

              <MiniStat
                title="Best Month"
                value={
                  summary.bestMonth ||
                  "No sales"
                }
                subtitle={
                  summary.bestMonth
                    ? money(
                        summary.bestMonthSales
                      )
                    : "Waiting for sales"
                }
              />

              <MiniStat
                title="Avg / Active Month"
                value={money(
                  averageMonthlyRevenue
                )}
                subtitle="Average revenue per active month"
              />

            </section>

            {/* ==================================================
                WEEK EXTRA ANALYTICS
            ================================================== */}

            <section className="mt-6 grid gap-4 md:grid-cols-3">

              <MiniStat
                title="Weekly Trading Days"
                value={`${tradingDays}`}
                subtitle="Days with at least one order"
              />

              <MiniStat
                title="Avg / Trading Day"
                value={money(
                  averagePerTradingDay
                )}
                subtitle="Weekly revenue per active day"
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

              <div className="mb-6">

                <p className="text-xs font-black uppercase tracking-[0.18em] text-lime-700">
                  Breakdown
                </p>

                <h2 className="mt-1 text-xl font-black">
                  Daily Sales
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Sales and orders for every
                  day this week.
                </p>

              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

                {week.map(
                  (day) => {
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
                        className={`rounded-2xl border p-4 ${
                          highest
                            ? "border-lime-300 bg-lime-50"
                            : day.isToday
                              ? "border-slate-300 bg-slate-100"
                              : "border-slate-200 bg-slate-50"
                        }`}
                      >

                        <div className="flex items-start justify-between">

                          <div>

                            <p className="font-black">
                              {
                                day.day
                              }
                            </p>

                            <p className="mt-1 text-xs font-semibold text-slate-400">
                              {formatShortDate(
                                day.date
                              )}
                            </p>

                          </div>

                          {highest && (
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-lime-400">
                              <Trophy
                                size={15}
                              />
                            </div>
                          )}

                        </div>

                        <p className="mt-5 text-2xl font-black">
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
                    );
                  }
                )}

              </div>

            </section>

            {/* ==================================================
                POS SHORTCUT
            ================================================== */}

            <section className="mt-6 pb-6">

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
                      Open the GenZ Kitchen POS.
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