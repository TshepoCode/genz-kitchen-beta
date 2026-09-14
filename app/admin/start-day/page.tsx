"use client";

import {
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  CalendarDays,
  ChefHat,
  Check,
  CircleDollarSign,
  ClipboardCheck,
  History,
  LayoutDashboard,
  Menu,
  Package,
  Receipt,
  ShoppingCart,
  Store,
  X,
} from "lucide-react";

type StockItem = {
  id: string;
  name: string;
  category: "sellable" | "ingredient";
  quantity: number;
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

const initialStock: StockItem[] = [
  // SELLABLE PRODUCTS
  {
    id: "zungu-chips",
    name: "Give Me Zungu + Chips",
    category: "sellable",
    quantity: 0,
  },
  {
    id: "chicken-quesadillas",
    name: "2 Chicken Quesadillas",
    category: "sellable",
    quantity: 0,
  },
  {
    id: "crunch-box-wrap",
    name: "Crunch Box Chicken Wrap + Chips",
    category: "sellable",
    quantity: 0,
  },
  {
    id: "cheesy-hotdog",
    name: "Cheesy Hotdog",
    category: "sellable",
    quantity: 0,
  },
  {
    id: "sticky-wings-5",
    name: "Mama's Sticky Wings - 5 + Chips",
    category: "sellable",
    quantity: 0,
  },
  {
    id: "sticky-wings-10",
    name: "Mama's Sticky Wings - 10 + Chips",
    category: "sellable",
    quantity: 0,
  },
  {
    id: "mini-bacon-dagwood",
    name: "Mini Bacon Dagwood + Small Chips",
    category: "sellable",
    quantity: 0,
  },
  {
    id: "cheesy-mince-russian-hotdog",
    name: "Cheesy Mince & Russian Hotdog",
    category: "sellable",
    quantity: 0,
  },

  // INGREDIENT / KITCHEN STOCK
  {
    id: "burger-buns",
    name: "Burger Buns",
    category: "ingredient",
    quantity: 0,
  },
  {
    id: "beef-patties",
    name: "Beef Patties",
    category: "ingredient",
    quantity: 0,
  },
  {
    id: "chicken-portions",
    name: "Chicken Portions",
    category: "ingredient",
    quantity: 0,
  },
  {
    id: "wings",
    name: "Chicken Wings",
    category: "ingredient",
    quantity: 0,
  },
  {
    id: "wraps",
    name: "Wraps / Tortillas",
    category: "ingredient",
    quantity: 0,
  },
  {
    id: "chips-portions",
    name: "Chips Portions",
    category: "ingredient",
    quantity: 0,
  },
  {
    id: "hotdog-rolls",
    name: "Hotdog Rolls",
    category: "ingredient",
    quantity: 0,
  },
];

export default function StartDayPage() {
  const [stock, setStock] =
    useState<StockItem[]>(initialStock);

  const [branch, setBranch] =
    useState("Kagiso");

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const sellableStock = stock.filter(
    (item) =>
      item.category === "sellable"
  );

  const ingredientStock = stock.filter(
    (item) =>
      item.category === "ingredient"
  );

  const totalSellableUnits =
    useMemo(() => {
      return sellableStock.reduce(
        (total, item) =>
          total +
          Number(item.quantity || 0),
        0
      );
    }, [sellableStock]);

  const totalKitchenUnits =
    useMemo(() => {
      return ingredientStock.reduce(
        (total, item) =>
          total +
          Number(item.quantity || 0),
        0
      );
    }, [ingredientStock]);

  function updateQuantity(
    id: string,
    value: string
  ) {
    const quantity =
      Math.max(
        0,
        Number(value) || 0
      );

    setStock((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity,
            }
          : item
      )
    );

    setError("");
    setSuccess("");
  }

  function todayLabel() {
    return new Intl.DateTimeFormat(
      "en-ZA",
      {
        timeZone:
          "Africa/Johannesburg",
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    ).format(new Date());
  }

  async function startTradingDay() {
    try {
      setError("");
      setSuccess("");

      if (
        totalSellableUnits === 0 &&
        totalKitchenUnits === 0
      ) {
        setError(
          "Please capture opening stock before starting the trading day."
        );
        return;
      }

      setSaving(true);

      /*
        NEXT STEP:

        We will replace this temporary section
        with:

        POST /api/kitchen/start-day

        which will create:
        - daily session
        - opening stock
        - opened_at
        - branch
        - trading date
      */

      await new Promise(
        (resolve) =>
          setTimeout(resolve, 500)
      );

      console.log({
        branch,
        stock,
      });

      setSuccess(
        "Opening stock captured. The page is ready to connect to the Start Day API."
      );
    } catch (err) {
      console.error(
        "Start day error:",
        err
      );

      setError(
        "Something went wrong while starting the day."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#eef0f2] text-slate-950">
      <div className="flex min-h-screen">
        {/* ========================= */}
        {/* DESKTOP SIDEBAR */}
        {/* ========================= */}

        <aside className="hidden w-[230px] shrink-0 border-r border-zinc-800 bg-[#151515] lg:flex lg:flex-col">
          <div className="flex h-20 items-center border-b border-zinc-800 px-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400 text-black">
                <ChefHat size={22} />
              </div>

              <div>
                <p className="text-lg font-black tracking-tight text-white">
                  GenZKitchen
                </p>

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                  Kitchen Operations
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
                  "Start Day";

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition ${
                      active
                        ? "bg-lime-400 text-black"
                        : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                    }`}
                  >
                    <Icon size={18} />

                    {item.name}
                  </Link>
                );
              }
            )}
          </nav>

          <div className="p-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
              <p className="text-xs font-black uppercase tracking-wider text-lime-400">
                {branch}
              </p>

              <div className="mt-2 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />

                <p className="text-sm font-black text-white">
                  Not Started
                </p>
              </div>

              <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                Capture opening stock before trading.
              </p>
            </div>
          </div>
        </aside>

        {/* ========================= */}
        {/* MAIN */}
        {/* ========================= */}

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
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-900 lg:hidden"
                >
                  <Menu size={20} />
                </button>

                <div className="flex items-center gap-2 lg:hidden">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-400 text-black">
                    <ChefHat
                      size={20}
                    />
                  </div>

                  <p className="font-black">
                    GenZKitchen
                  </p>
                </div>

                <div className="hidden lg:block">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    GenZ Kitchen
                  </p>

                  <p className="font-black">
                    Start of Day
                  </p>
                </div>
              </div>

              <Link
                href="/admin/kitchen"
                className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white transition hover:bg-slate-800"
              >
                Dashboard
              </Link>
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

              <div className="relative h-full w-[280px] bg-[#151515] p-4 shadow-2xl">
                <div className="mb-6 flex items-center justify-between">
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
                    <X size={18} />
                  </button>
                </div>

                <nav className="space-y-1">
                  {navigation.map(
                    (item) => {
                      const Icon =
                        item.icon;

                      const active =
                        item.name ===
                        "Start Day";

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
          {/* CONTENT */}
          {/* ========================= */}

          <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
            {/* TITLE */}
            <section className="mb-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-lime-700">
                    <ClipboardCheck
                      size={17}
                    />

                    <span className="text-xs font-black uppercase tracking-[0.18em]">
                      Opening Checklist
                    </span>
                  </div>

                  <h1 className="text-3xl font-black tracking-tight">
                    Start Trading Day
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Count the kitchen's opening stock before the first sale.
                  </p>
                </div>

                <div className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <CalendarDays
                    size={17}
                    className="text-lime-700"
                  />

                  <p className="text-sm font-bold text-slate-700">
                    {todayLabel()}
                  </p>
                </div>
              </div>
            </section>

            {/* STATUS / BRANCH */}
            <section className="mb-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-100 text-lime-700">
                    <Store size={21} />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Branch
                    </p>

                    <select
                      value={branch}
                      onChange={(e) =>
                        setBranch(
                          e.target.value
                        )
                      }
                      className="mt-1 bg-transparent text-lg font-black text-slate-950 outline-none"
                    >
                      <option value="Kagiso">
                        Kagiso
                      </option>

                      <option value="Cosmo City">
                        Cosmo City
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-[#181818] p-5 shadow-sm">
                <p className="text-xs font-black uppercase tracking-wider text-zinc-500">
                  Trading Status
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-yellow-400" />

                  <div>
                    <p className="font-black text-white">
                      Waiting to Start
                    </p>

                    <p className="text-xs text-zinc-500">
                      Complete opening stock first
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* ERRORS */}
            {error && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-lime-300 bg-lime-100 p-4 text-lime-900">
                <Check
                  size={20}
                  className="mt-0.5"
                />

                <p className="text-sm font-bold">
                  {success}
                </p>
              </div>
            )}

            {/* SUMMARY */}
            <section className="mb-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-slate-500">
                  Sellable Products
                </p>

                <p className="mt-2 text-3xl font-black">
                  {totalSellableUnits}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Total opening units
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-slate-500">
                  Kitchen Stock
                </p>

                <p className="mt-2 text-3xl font-black">
                  {totalKitchenUnits}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Total counted units
                </p>
              </div>
            </section>

            {/* ========================= */}
            {/* SELLABLE STOCK */}
            {/* ========================= */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black">
                    Sellable Stock
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    How many portions/items are ready or available to sell today?
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-100 text-lime-700">
                  <ShoppingCart
                    size={21}
                  />
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {sellableStock.map(
                  (item) => (
                    <StockInput
                      key={item.id}
                      item={item}
                      onChange={
                        updateQuantity
                      }
                    />
                  )
                )}
              </div>
            </section>

            {/* ========================= */}
            {/* INGREDIENT STOCK */}
            {/* ========================= */}

            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black">
                    Kitchen Stock
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Count important ingredients and portions before trading.
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <Package size={21} />
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {ingredientStock.map(
                  (item) => (
                    <StockInput
                      key={item.id}
                      item={item}
                      onChange={
                        updateQuantity
                      }
                    />
                  )
                )}
              </div>
            </section>

            {/* ========================= */}
            {/* START DAY */}
            {/* ========================= */}

            <section className="mt-6">
              <div className="rounded-2xl border border-zinc-800 bg-[#181818] p-5 shadow-sm sm:p-6">
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-lime-400">
                      Ready to Trade?
                    </p>

                    <h2 className="mt-2 text-xl font-black text-white">
                      Start today's kitchen session
                    </h2>

                    <p className="mt-1 max-w-xl text-sm text-zinc-500">
                      Once started, sales will belong to today's trading session and opening stock becomes the starting balance.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={
                      startTradingDay
                    }
                    disabled={saving}
                    className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-lime-400 px-6 py-4 font-black text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400 md:w-auto"
                  >
                    <ClipboardCheck
                      size={20}
                    />

                    {saving
                      ? "Starting Day..."
                      : "Start Trading Day"}
                  </button>
                </div>
              </div>
            </section>

            <footer className="mt-8 border-t border-slate-300 py-6">
              <p className="text-xs font-semibold text-slate-400">
                GenZ Kitchen • Start of Day
              </p>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}

function StockInput({
  item,
  onChange,
}: {
  item: StockItem;
  onChange: (
    id: string,
    value: string
  ) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="min-w-0">
        <p className="font-bold text-slate-900">
          {item.name}
        </p>

        <p className="mt-1 text-xs font-semibold text-slate-400">
          Opening quantity
        </p>
      </div>

      <input
        type="number"
        min="0"
        inputMode="numeric"
        value={
          item.quantity === 0
            ? ""
            : item.quantity
        }
        onChange={(e) =>
          onChange(
            item.id,
            e.target.value
          )
        }
        placeholder="0"
        className="h-12 w-24 rounded-xl border border-slate-300 bg-white px-3 text-center text-lg font-black text-slate-950 outline-none transition focus:border-lime-500 focus:ring-4 focus:ring-lime-100"
      />
    </div>
  );
}