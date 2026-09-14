"use client";

import {
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  AlertTriangle,
  ChefHat,
  CircleDollarSign,
  ClipboardCheck,
  History,
  LayoutDashboard,
  Menu,
  Package,
  Plus,
  Receipt,
  Search,
  ShoppingCart,
  TrendingDown,
  Warehouse,
  X,
} from "lucide-react";

type StockCategory =
  | "sellable"
  | "ingredient";

type StockItem = {
  id: string;
  name: string;
  category: StockCategory;

  opening: number;
  sold: number;

  adjustment: number;

  unit: string;

  lowStockLevel: number;
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
  // =====================================
  // SELLABLE PRODUCTS
  // =====================================

  {
    id: "zungu-chips",
    name: "Give Me Zungu + Chips",
    category: "sellable",

    opening: 15,
    sold: 0,

    adjustment: 0,

    unit: "meals",

    lowStockLevel: 4,
  },

  {
    id: "chicken-quesadillas",
    name: "2 Chicken Quesadillas",
    category: "sellable",

    opening: 10,
    sold: 0,

    adjustment: 0,

    unit: "sets",

    lowStockLevel: 3,
  },

  {
    id: "crunch-box-wrap",
    name: "Crunch Box Chicken Wrap + Chips",
    category: "sellable",

    opening: 10,
    sold: 0,

    adjustment: 0,

    unit: "meals",

    lowStockLevel: 3,
  },

  {
    id: "cheesy-hotdog",
    name: "Cheesy Hotdog",
    category: "sellable",

    opening: 10,
    sold: 0,

    adjustment: 0,

    unit: "hotdogs",

    lowStockLevel: 3,
  },

  {
    id: "sticky-wings-5",
    name: "Mama's Sticky Wings - 5 + Chips",
    category: "sellable",

    opening: 10,
    sold: 0,

    adjustment: 0,

    unit: "meals",

    lowStockLevel: 3,
  },

  {
    id: "sticky-wings-10",
    name: "Mama's Sticky Wings - 10 + Chips",
    category: "sellable",

    opening: 6,
    sold: 0,

    adjustment: 0,

    unit: "meals",

    lowStockLevel: 2,
  },

  {
    id: "mini-bacon-dagwood",
    name: "Mini Bacon Dagwood + Small Chips",
    category: "sellable",

    opening: 10,
    sold: 0,

    adjustment: 0,

    unit: "meals",

    lowStockLevel: 3,
  },

  {
    id: "cheesy-mince-russian-hotdog",
    name: "Cheesy Mince & Russian Hotdog",
    category: "sellable",

    opening: 10,
    sold: 0,

    adjustment: 0,

    unit: "hotdogs",

    lowStockLevel: 3,
  },

  // =====================================
  // INGREDIENTS
  // =====================================

  {
    id: "burger-buns",
    name: "Burger Buns",
    category: "ingredient",

    opening: 20,
    sold: 0,

    adjustment: 0,

    unit: "units",

    lowStockLevel: 5,
  },

  {
    id: "beef-patties",
    name: "Beef Patties",
    category: "ingredient",

    opening: 30,
    sold: 0,

    adjustment: 0,

    unit: "patties",

    lowStockLevel: 10,
  },

  {
    id: "chicken-portions",
    name: "Chicken Portions",
    category: "ingredient",

    opening: 25,
    sold: 0,

    adjustment: 0,

    unit: "portions",

    lowStockLevel: 8,
  },

  {
    id: "wings",
    name: "Chicken Wings",
    category: "ingredient",

    opening: 70,
    sold: 0,

    adjustment: 0,

    unit: "wings",

    lowStockLevel: 20,
  },

  {
    id: "wraps",
    name: "Wraps / Tortillas",
    category: "ingredient",

    opening: 20,
    sold: 0,

    adjustment: 0,

    unit: "wraps",

    lowStockLevel: 5,
  },

  {
    id: "chips-portions",
    name: "Chips Portions",
    category: "ingredient",

    opening: 40,
    sold: 0,

    adjustment: 0,

    unit: "portions",

    lowStockLevel: 10,
  },

  {
    id: "hotdog-rolls",
    name: "Hotdog Rolls",
    category: "ingredient",

    opening: 20,
    sold: 0,

    adjustment: 0,

    unit: "rolls",

    lowStockLevel: 5,
  },

  {
    id: "cheese",
    name: "Cheese Portions",
    category: "ingredient",

    opening: 30,
    sold: 0,

    adjustment: 0,

    unit: "portions",

    lowStockLevel: 8,
  },

  {
    id: "russians",
    name: "Russian Sausages",
    category: "ingredient",

    opening: 15,
    sold: 0,

    adjustment: 0,

    unit: "units",

    lowStockLevel: 4,
  },

  {
    id: "bacon",
    name: "Bacon Portions",
    category: "ingredient",

    opening: 15,
    sold: 0,

    adjustment: 0,

    unit: "portions",

    lowStockLevel: 4,
  },
];

export default function StockPage() {
  const [stock, setStock] =
    useState<StockItem[]>(
      initialStock
    );

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  const [search, setSearch] =
    useState("");

  const [activeTab, setActiveTab] =
    useState<
      "all" |
      "sellable" |
      "ingredient"
    >("all");

  const [
    adjustingItem,
    setAdjustingItem,
  ] = useState<StockItem | null>(
    null
  );

  const [
    adjustmentAmount,
    setAdjustmentAmount,
  ] = useState("");

  const [
    adjustmentType,
    setAdjustmentType,
  ] = useState<
    "add" | "subtract"
  >("add");

  function remaining(
    item: StockItem
  ) {
    return Math.max(
      0,
      Number(
        item.opening || 0
      ) -
        Number(
          item.sold || 0
        ) +
        Number(
          item.adjustment || 0
        )
    );
  }

  const filteredStock =
    useMemo(() => {
      return stock.filter(
        (item) => {
          const matchesSearch =
            item.name
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesTab =
            activeTab === "all" ||
            item.category ===
              activeTab;

          return (
            matchesSearch &&
            matchesTab
          );
        }
      );
    }, [
      stock,
      search,
      activeTab,
    ]);

  const sellableStock =
    filteredStock.filter(
      (item) =>
        item.category ===
        "sellable"
    );

  const ingredientStock =
    filteredStock.filter(
      (item) =>
        item.category ===
        "ingredient"
    );

  const lowStockItems =
    stock.filter(
      (item) =>
        remaining(item) <=
        item.lowStockLevel
    );

  const totalItems =
    stock.length;

  const totalOpening =
    stock.reduce(
      (sum, item) =>
        sum +
        Number(
          item.opening || 0
        ),
      0
    );

  const totalRemaining =
    stock.reduce(
      (sum, item) =>
        sum +
        remaining(item),
      0
    );

  function openAdjustment(
    item: StockItem
  ) {
    setAdjustingItem(
      item
    );

    setAdjustmentAmount(
      ""
    );

    setAdjustmentType(
      "add"
    );
  }

  function closeAdjustment() {
    setAdjustingItem(
      null
    );

    setAdjustmentAmount(
      ""
    );
  }

  function confirmAdjustment() {
    if (
      !adjustingItem
    ) {
      return;
    }

    const amount =
      Number(
        adjustmentAmount
      );

    if (
      Number.isNaN(amount) ||
      amount <= 0
    ) {
      return;
    }

    setStock(
      (current) =>
        current.map(
          (item) => {
            if (
              item.id !==
              adjustingItem.id
            ) {
              return item;
            }

            const change =
              adjustmentType ===
              "add"
                ? amount
                : -amount;

            return {
              ...item,

              adjustment:
                item.adjustment +
                change,
            };
          }
        )
    );

    closeAdjustment();
  }

  function todayLabel() {
    return new Intl.DateTimeFormat(
      "en-ZA",
      {
        timeZone:
          "Africa/Johannesburg",

        weekday:
          "long",

        day:
          "numeric",

        month:
          "long",

        year:
          "numeric",
      }
    ).format(
      new Date()
    );
  }

  return (
    <main className="min-h-screen bg-[#eef0f2] text-slate-950">
      <div className="flex min-h-screen">
        {/* ================================= */}
        {/* DESKTOP SIDEBAR */}
        {/* ================================= */}

        <aside className="hidden w-[230px] shrink-0 border-r border-zinc-800 bg-[#151515] lg:flex lg:flex-col">
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
                  "Stock";

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

          {/* LOW STOCK SIDEBAR */}
          <div className="p-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
              <p className="text-xs font-black uppercase tracking-wider text-lime-400">
                Stock Status
              </p>

              <div className="mt-3 flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    lowStockItems.length >
                    0
                      ? "bg-yellow-400"
                      : "bg-lime-400"
                  }`}
                />

                <p className="text-sm font-black text-white">
                  {lowStockItems.length >
                  0
                    ? `${lowStockItems.length} Low Stock`
                    : "Stock Healthy"}
                </p>
              </div>

              <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                Monitor stock before products run out.
              </p>
            </div>
          </div>
        </aside>

        {/* ================================= */}
        {/* MAIN */}
        {/* ================================= */}

        <div className="min-w-0 flex-1">
          {/* TOP NAV */}

          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
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

                  <p className="font-black">
                    GenZKitchen
                  </p>
                </div>

                {/* DESKTOP TITLE */}

                <div className="hidden lg:block">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    GenZ Kitchen
                  </p>

                  <p className="font-black">
                    Stock Control
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

          {/* ================================= */}
          {/* MOBILE MENU */}
          {/* ================================= */}

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
                        "Stock";

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

          {/* ================================= */}
          {/* PAGE CONTENT */}
          {/* ================================= */}

          <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
            {/* TITLE */}

            <section className="mb-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-lime-700">
                    <Warehouse
                      size={17}
                    />

                    <span className="text-xs font-black uppercase tracking-[0.18em]">
                      Inventory Control
                    </span>
                  </div>

                  <h1 className="text-3xl font-black tracking-tight">
                    Stock
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    View today's stock levels and identify items that need attention.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm">
                  {todayLabel()}
                </div>
              </div>
            </section>

            {/* ================================= */}
            {/* SUMMARY */}
            {/* ================================= */}

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard
                title="Stock Items"
                value={String(
                  totalItems
                )}
                subtitle="Items being monitored"
                icon={
                  <Package
                    size={21}
                  />
                }
              />

              <SummaryCard
                title="Opening Units"
                value={String(
                  totalOpening
                )}
                subtitle="Stock counted at opening"
                icon={
                  <Warehouse
                    size={21}
                  />
                }
              />

              <SummaryCard
                title="Remaining Units"
                value={String(
                  totalRemaining
                )}
                subtitle="Current expected stock"
                icon={
                  <ShoppingCart
                    size={21}
                  />
                }
              />

              <SummaryCard
                title="Low Stock"
                value={String(
                  lowStockItems.length
                )}
                subtitle="Items needing attention"
                warning={
                  lowStockItems.length >
                  0
                }
                icon={
                  <TrendingDown
                    size={21}
                  />
                }
              />
            </section>

            {/* ================================= */}
            {/* LOW STOCK */}
            {/* ================================= */}

            {lowStockItems.length >
              0 && (
              <section className="mt-6 rounded-2xl border border-yellow-300 bg-yellow-50 p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-400 text-black">
                    <AlertTriangle
                      size={20}
                    />
                  </div>

                  <div className="flex-1">
                    <h2 className="font-black text-slate-950">
                      Low Stock Alerts
                    </h2>

                    <p className="mt-1 text-sm text-slate-600">
                      These items are close to or below their minimum stock level.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {lowStockItems.map(
                        (item) => (
                          <span
                            key={
                              item.id
                            }
                            className="rounded-lg border border-yellow-300 bg-white px-3 py-2 text-xs font-bold text-slate-700"
                          >
                            {
                              item.name
                            }{" "}
                            •{" "}
                            {remaining(
                              item
                            )}{" "}
                            left
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ================================= */}
            {/* SEARCH */}
            {/* ================================= */}

            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                {/* SEARCH */}

                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                      setSearch(
                        e.target.value
                      )
                    }
                    placeholder="Search stock..."
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-lime-400 focus:ring-4 focus:ring-lime-100"
                  />
                </div>

                {/* FILTERS */}

                <div className="flex gap-2 overflow-x-auto">
                  <FilterButton
                    label="All"
                    active={
                      activeTab ===
                      "all"
                    }
                    onClick={() =>
                      setActiveTab(
                        "all"
                      )
                    }
                  />

                  <FilterButton
                    label="Products"
                    active={
                      activeTab ===
                      "sellable"
                    }
                    onClick={() =>
                      setActiveTab(
                        "sellable"
                      )
                    }
                  />

                  <FilterButton
                    label="Ingredients"
                    active={
                      activeTab ===
                      "ingredient"
                    }
                    onClick={() =>
                      setActiveTab(
                        "ingredient"
                      )
                    }
                  />
                </div>
              </div>
            </section>

            {/* ================================= */}
            {/* SELLABLE STOCK */}
            {/* ================================= */}

            {sellableStock.length >
              0 && (
              <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black">
                      Sellable Products
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Finished menu items available for customers.
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-100 text-lime-700">
                    <ShoppingCart
                      size={21}
                    />
                  </div>
                </div>

                <StockTable
                  items={
                    sellableStock
                  }
                  remaining={
                    remaining
                  }
                  onAdjust={
                    openAdjustment
                  }
                />
              </section>
            )}

            {/* ================================= */}
            {/* INGREDIENT STOCK */}
            {/* ================================= */}

            {ingredientStock.length >
              0 && (
              <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black">
                      Kitchen Ingredients
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Important ingredients and portions used during trading.
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    <Package
                      size={21}
                    />
                  </div>
                </div>

                <StockTable
                  items={
                    ingredientStock
                  }
                  remaining={
                    remaining
                  }
                  onAdjust={
                    openAdjustment
                  }
                />
              </section>
            )}

            {/* ================================= */}
            {/* STOCK EXPLANATION */}
            {/* ================================= */}

            <section className="mt-6">
              <div className="rounded-2xl border border-zinc-800 bg-[#181818] p-5 text-white shadow-sm">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-lime-400">
                  Stock Calculation
                </p>

                <h2 className="mt-2 text-xl font-black">
                  How stock will work
                </h2>

                <div className="mt-4 rounded-xl bg-zinc-900 p-4">
                  <p className="font-black text-white">
                    Opening Stock
                  </p>

                  <p className="text-zinc-500">
                    + Adjustments
                  </p>

                  <p className="text-zinc-500">
                    − Sold / Used
                  </p>

                  <div className="my-3 h-px bg-zinc-800" />

                  <p className="font-black text-lime-400">
                    = Expected Remaining Stock
                  </p>
                </div>
              </div>
            </section>

            <footer className="mt-8 border-t border-slate-300 py-6">
              <p className="text-xs font-semibold text-slate-400">
                GenZ Kitchen • Stock Control
              </p>
            </footer>
          </div>
        </div>
      </div>

      {/* ================================= */}
      {/* ADJUST STOCK MODAL */}
      {/* ================================= */}

      {adjustingItem && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center">
          <button
            type="button"
            aria-label="Close stock adjustment"
            onClick={
              closeAdjustment
            }
            className="absolute inset-0"
          />

          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-lime-700">
                  Stock Adjustment
                </p>

                <h2 className="mt-1 text-xl font-black text-slate-950">
                  {
                    adjustingItem.name
                  }
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Current expected stock:{" "}
                  <span className="font-black text-slate-900">
                    {remaining(
                      adjustingItem
                    )}
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeAdjustment
                }
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600"
              >
                <X
                  size={17}
                />
              </button>
            </div>

            {/* TYPE */}

            <div className="mt-6">
              <p className="mb-2 text-sm font-black text-slate-900">
                Adjustment Type
              </p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setAdjustmentType(
                      "add"
                    )
                  }
                  className={`rounded-xl border px-4 py-3 text-sm font-black ${
                    adjustmentType ===
                    "add"
                      ? "border-lime-400 bg-lime-400 text-black"
                      : "border-slate-200 bg-slate-50 text-slate-600"
                  }`}
                >
                  Add Stock
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setAdjustmentType(
                      "subtract"
                    )
                  }
                  className={`rounded-xl border px-4 py-3 text-sm font-black ${
                    adjustmentType ===
                    "subtract"
                      ? "border-red-400 bg-red-50 text-red-700"
                      : "border-slate-200 bg-slate-50 text-slate-600"
                  }`}
                >
                  Remove Stock
                </button>
              </div>
            </div>

            {/* QUANTITY */}

            <div className="mt-5">
              <label className="text-sm font-black text-slate-900">
                Quantity
              </label>

              <input
                type="number"
                min="1"
                inputMode="numeric"
                value={
                  adjustmentAmount
                }
                onChange={(e) =>
                  setAdjustmentAmount(
                    e.target.value
                  )
                }
                placeholder="0"
                className="mt-2 h-14 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 text-xl font-black outline-none transition focus:border-lime-500 focus:ring-4 focus:ring-lime-100"
              />
            </div>

            <button
              type="button"
              onClick={
                confirmAdjustment
              }
              disabled={
                !adjustmentAmount ||
                Number(
                  adjustmentAmount
                ) <= 0
              }
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-4 font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            >
              <Plus
                size={18}
              />

              Save Adjustment
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

/* ========================================= */
/* STOCK TABLE */
/* ========================================= */

function StockTable({
  items,
  remaining,
  onAdjust,
}: {
  items: StockItem[];

  remaining: (
    item: StockItem
  ) => number;

  onAdjust: (
    item: StockItem
  ) => void;
}) {
  return (
    <>
      {/* DESKTOP */}

      <div className="hidden overflow-hidden rounded-xl border border-slate-200 md:block">
        <div className="grid grid-cols-[2fr_100px_100px_120px_100px] bg-slate-100 px-4 py-3 text-xs font-black uppercase tracking-wide text-slate-500">
          <span>
            Item
          </span>

          <span className="text-center">
            Opening
          </span>

          <span className="text-center">
            Sold
          </span>

          <span className="text-center">
            Remaining
          </span>

          <span />
        </div>

        {items.map(
          (item, index) => {
            const current =
              remaining(item);

            const low =
              current <=
              item.lowStockLevel;

            return (
              <div
                key={
                  item.id
                }
                className={`grid grid-cols-[2fr_100px_100px_120px_100px] items-center px-4 py-4 ${
                  index !==
                  items.length -
                    1
                    ? "border-b border-slate-100"
                    : ""
                }`}
              >
                <div>
                  <p className="font-bold text-slate-900">
                    {
                      item.name
                    }
                  </p>

                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-xs font-semibold text-slate-400">
                      {
                        item.unit
                      }
                    </p>

                    {item.adjustment !==
                      0 && (
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-black text-blue-700">
                        {item.adjustment >
                        0
                          ? "+"
                          : ""}
                        {
                          item.adjustment
                        }{" "}
                        adjusted
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-center font-black">
                  {
                    item.opening
                  }
                </p>

                <p className="text-center font-black text-slate-500">
                  {
                    item.sold
                  }
                </p>

                <div className="text-center">
                  <span
                    className={`inline-flex min-w-12 justify-center rounded-lg px-3 py-2 font-black ${
                      low
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-lime-100 text-lime-800"
                    }`}
                  >
                    {
                      current
                    }
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onAdjust(
                      item
                    )
                  }
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 transition hover:border-lime-300 hover:bg-lime-50"
                >
                  Adjust
                </button>
              </div>
            );
          }
        )}
      </div>

      {/* MOBILE */}

      <div className="space-y-3 md:hidden">
        {items.map(
          (item) => {
            const current =
              remaining(item);

            const low =
              current <=
              item.lowStockLevel;

            return (
              <div
                key={
                  item.id
                }
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-black text-slate-900">
                      {
                        item.name
                      }
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {
                        item.unit
                      }
                    </p>
                  </div>

                  <span
                    className={`rounded-lg px-3 py-2 font-black ${
                      low
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-lime-100 text-lime-800"
                    }`}
                  >
                    {
                      current
                    }
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <StockMiniStat
                    label="Opening"
                    value={
                      item.opening
                    }
                  />

                  <StockMiniStat
                    label="Sold"
                    value={
                      item.sold
                    }
                  />

                  <StockMiniStat
                    label="Adjust"
                    value={
                      item.adjustment
                    }
                  />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onAdjust(
                      item
                    )
                  }
                  className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700"
                >
                  Adjust Stock
                </button>
              </div>
            );
          }
        )}
      </div>
    </>
  );
}

/* ========================================= */
/* SUMMARY CARD */
/* ========================================= */

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  warning = false,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  warning?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${
            warning
              ? "bg-yellow-100 text-yellow-700"
              : "bg-lime-100 text-lime-700"
          }`}
        >
          {icon}
        </div>

        <span
          className={`h-2 w-2 rounded-full ${
            warning
              ? "bg-yellow-400"
              : "bg-lime-400"
          }`}
        />
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
/* FILTER BUTTON */
/* ========================================= */

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={`whitespace-nowrap rounded-xl px-4 py-3 text-sm font-black transition ${
        active
          ? "bg-slate-950 text-white"
          : "border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
      }`}
    >
      {label}
    </button>
  );
}

/* ========================================= */
/* STOCK MINI STAT */
/* ========================================= */

function StockMiniStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl bg-white p-3 text-center">
      <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 font-black text-slate-900">
        {value}
      </p>
    </div>
  );
}