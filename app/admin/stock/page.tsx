"use client";

import { useMemo, useState } from "react";
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
  Trash2,
  Warehouse,
  X,
  Minus,
  Check,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type StockItem = {
  id: string;
  name: string;
  unit: string;
  holding: number;
  lowStockLevel: number;
};

type StockInput = {
  [key: string]: string;
};

/* =========================================================
   NAVIGATION
========================================================= */

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

/* =========================================================
   DEFAULT INGREDIENTS

   All stock starts at 0.
   Later these will come from Supabase.
========================================================= */

const initialStock: StockItem[] = [
  {
    id: "burger-buns",
    name: "Burger Buns",
    unit: "units",
    holding: 0,
    lowStockLevel: 5,
  },
  {
    id: "beef-patties",
    name: "Beef Patties",
    unit: "patties",
    holding: 0,
    lowStockLevel: 10,
  },
  {
    id: "chicken-portions",
    name: "Chicken Portions",
    unit: "portions",
    holding: 0,
    lowStockLevel: 8,
  },
  {
    id: "chicken-wings",
    name: "Chicken Wings",
    unit: "wings",
    holding: 0,
    lowStockLevel: 20,
  },
  {
    id: "wraps",
    name: "Wraps / Tortillas",
    unit: "wraps",
    holding: 0,
    lowStockLevel: 5,
  },
  {
    id: "chips-portions",
    name: "Chips Portions",
    unit: "portions",
    holding: 0,
    lowStockLevel: 10,
  },
  {
    id: "hotdog-rolls",
    name: "Hotdog Rolls",
    unit: "rolls",
    holding: 0,
    lowStockLevel: 5,
  },
  {
    id: "cheese-portions",
    name: "Cheese Portions",
    unit: "portions",
    holding: 0,
    lowStockLevel: 8,
  },
  {
    id: "russian-sausages",
    name: "Russian Sausages",
    unit: "units",
    holding: 0,
    lowStockLevel: 4,
  },
  {
    id: "bacon-portions",
    name: "Bacon Portions",
    unit: "portions",
    holding: 0,
    lowStockLevel: 4,
  },
];

/* =========================================================
   PAGE
========================================================= */

export default function StockPage() {
  const [stock, setStock] =
    useState<StockItem[]>(initialStock);

  const [stockInputs, setStockInputs] =
    useState<StockInput>({});

  const [search, setSearch] =
    useState("");

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  const [
    addIngredientOpen,
    setAddIngredientOpen,
  ] = useState(false);

  const [
    ingredientName,
    setIngredientName,
  ] = useState("");

  const [
    ingredientUnit,
    setIngredientUnit,
  ] = useState("units");

  const [
    ingredientLowLevel,
    setIngredientLowLevel,
  ] = useState("5");

  const [
    ingredientStartingQuantity,
    setIngredientStartingQuantity,
  ] = useState("0");

  const [
    savedMessage,
    setSavedMessage,
  ] = useState("");

  /* =========================================================
     FILTER
  ========================================================= */

  const filteredStock =
    useMemo(() => {
      const value =
        search
          .trim()
          .toLowerCase();

      if (!value) {
        return stock;
      }

      return stock.filter(
        (item) =>
          item.name
            .toLowerCase()
            .includes(value)
      );
    }, [stock, search]);

  /* =========================================================
     SUMMARY
  ========================================================= */

  const totalIngredients =
    stock.length;

  const totalHolding =
    stock.reduce(
      (sum, item) =>
        sum +
        Number(
          item.holding || 0
        ),
      0
    );

  const outOfStock =
    stock.filter(
      (item) =>
        item.holding <= 0
    ).length;

  const lowStock =
    stock.filter(
      (item) =>
        item.holding > 0 &&
        item.holding <=
          item.lowStockLevel
    ).length;

  /* =========================================================
     DATE
  ========================================================= */

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

  /* =========================================================
     INPUT HANDLING
  ========================================================= */

  function updateStockInput(
    id: string,
    value: string
  ) {
    if (
      value !== "" &&
      Number(value) < 0
    ) {
      return;
    }

    setStockInputs(
      (current) => ({
        ...current,
        [id]: value,
      })
    );
  }

  function increaseInput(
    id: string
  ) {
    const current =
      Number(
        stockInputs[id] || 0
      );

    setStockInputs(
      (inputs) => ({
        ...inputs,
        [id]: String(
          current + 1
        ),
      })
    );
  }

  function decreaseInput(
    id: string
  ) {
    const current =
      Number(
        stockInputs[id] || 0
      );

    setStockInputs(
      (inputs) => ({
        ...inputs,
        [id]: String(
          Math.max(
            0,
            current - 1
          )
        ),
      })
    );
  }

  /* =========================================================
     ADD STOCK

     For now this updates local React state.
     Next step: replace with Supabase/API call.
  ========================================================= */

  function saveStock(
    item: StockItem
  ) {
    const quantity =
      Number(
        stockInputs[
          item.id
        ] || 0
      );

    if (
      !Number.isFinite(
        quantity
      ) ||
      quantity <= 0
    ) {
      return;
    }

    setStock(
      (current) =>
        current.map(
          (stockItem) =>
            stockItem.id ===
            item.id
              ? {
                  ...stockItem,
                  holding:
                    stockItem.holding +
                    quantity,
                }
              : stockItem
        )
    );

    setStockInputs(
      (current) => ({
        ...current,
        [item.id]: "",
      })
    );

    showSavedMessage(
      `${quantity} ${item.unit} added to ${item.name}.`
    );
  }

  /* =========================================================
     ADD NEW INGREDIENT
  ========================================================= */

  function addIngredient() {
    const name =
      ingredientName.trim();

    const lowLevel =
      Number(
        ingredientLowLevel
      );

    const startingQuantity =
      Number(
        ingredientStartingQuantity
      );

    if (!name) {
      return;
    }

    if (
      !Number.isFinite(
        lowLevel
      ) ||
      lowLevel < 0
    ) {
      return;
    }

    if (
      !Number.isFinite(
        startingQuantity
      ) ||
      startingQuantity < 0
    ) {
      return;
    }

    const newItem: StockItem =
      {
        id: `${Date.now()}-${name
          .toLowerCase()
          .replace(
            /[^a-z0-9]+/g,
            "-"
          )}`,

        name,

        unit:
          ingredientUnit,

        holding:
          startingQuantity,

        lowStockLevel:
          lowLevel,
      };

    setStock(
      (current) => [
        ...current,
        newItem,
      ]
    );

    setIngredientName(
      ""
    );

    setIngredientUnit(
      "units"
    );

    setIngredientLowLevel(
      "5"
    );

    setIngredientStartingQuantity(
      "0"
    );

    setAddIngredientOpen(
      false
    );

    showSavedMessage(
      `${name} added to stock.`
    );
  }

  /* =========================================================
     DELETE INGREDIENT

     Temporary local behaviour.
     Later database ingredients should preferably be archived.
  ========================================================= */

  function deleteIngredient(
    item: StockItem
  ) {
    const confirmed =
      window.confirm(
        `Remove ${item.name} from the stock list?`
      );

    if (!confirmed) {
      return;
    }

    setStock(
      (current) =>
        current.filter(
          (stockItem) =>
            stockItem.id !==
            item.id
        )
    );

    showSavedMessage(
      `${item.name} removed.`
    );
  }

  /* =========================================================
     MESSAGE
  ========================================================= */

  function showSavedMessage(
    message: string
  ) {
    setSavedMessage(
      message
    );

    window.setTimeout(
      () => {
        setSavedMessage(
          ""
        );
      },
      3000
    );
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main className="min-h-screen bg-[#eef0f2] text-slate-950">
      <div className="flex min-h-screen">

        {/* =====================================================
            DESKTOP SIDEBAR
        ===================================================== */}

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

          {/* HOLDING STATUS */}

          <div className="p-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">

              <p className="text-xs font-black uppercase tracking-wider text-lime-400">
                Holding Stock
              </p>

              <p className="mt-3 text-2xl font-black text-white">
                {totalHolding}
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Total units currently recorded
              </p>

              <div className="mt-4 border-t border-zinc-800 pt-4">
                <p className="text-xs font-bold text-zinc-400">
                  {outOfStock} out of stock
                </p>

                <p className="mt-1 text-xs font-bold text-zinc-400">
                  {lowStock} low stock
                </p>
              </div>

            </div>
          </div>
        </aside>

        {/* =====================================================
            MAIN AREA
        ===================================================== */}

        <div className="min-w-0 flex-1">

          {/* ===================================================
              TOP NAV
          =================================================== */}

          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">

            <div className="flex h-15 items-center justify-between px-4 sm:px-3 lg:px-4">

              <div className="flex items-center gap-2">

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
                    Stock Management
                  </p>

                </div>

              </div>

              <Link
                href="/admin/kitchen"
                className="rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-black text-white transition hover:bg-slate-800"
              >
                Dashboard
              </Link>

            </div>

          </header>

          {/* ===================================================
              MOBILE MENU
          =================================================== */}

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

          {/* ===================================================
              CONTENT
          =================================================== */}

          <div className="mx-auto max-w-[1450px] px-4 py-6 sm:px-6 lg:px-8">

            {/* =================================================
                TITLE
            ================================================= */}

            <section className="mb-6">

              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

                <div>

                  <div className="mb-2 flex items-center gap-2 text-lime-700">

                    <Warehouse
                      size={17}
                    />

                    <span className="text-xs font-black uppercase tracking-[0.18em]">
                      Inventory
                    </span>

                  </div>

                  <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                    Stock
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
                    Add ingredients and record stock received into the kitchen.
                    Saved quantities become your current holding stock.
                  </p>

                </div>

                <div className="flex flex-col gap-2 sm:flex-row">

                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 shadow-sm">
                    {todayLabel()}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setAddIngredientOpen(
                        true
                      )
                    }
                    className="flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-5 py-3 text-sm font-black text-black transition hover:bg-lime-300"
                  >
                    <Plus
                      size={18}
                    />

                    Add Ingredient
                  </button>

                </div>

              </div>

            </section>

            {/* =================================================
                SAVED MESSAGE
            ================================================= */}

            {savedMessage && (
              <div className="mb-5 flex items-center gap-3 rounded-xl border border-lime-300 bg-lime-50 px-4 py-3 text-sm font-bold text-lime-900">

                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-lime-400 text-black">
                  <Check
                    size={15}
                  />
                </div>

                {savedMessage}

              </div>
            )}

            {/* =================================================
                SUMMARY
            ================================================= */}

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <SummaryCard
                title="Ingredients"
                value={String(
                  totalIngredients
                )}
                subtitle="Ingredients being tracked"
                icon={
                  <Package
                    size={21}
                  />
                }
              />

              <SummaryCard
                title="Holding Units"
                value={String(
                  totalHolding
                )}
                subtitle="Current recorded stock"
                icon={
                  <Warehouse
                    size={21}
                  />
                }
              />

              <SummaryCard
                title="Low Stock"
                value={String(
                  lowStock
                )}
                subtitle="Below warning level"
                warning={
                  lowStock > 0
                }
                icon={
                  <AlertTriangle
                    size={21}
                  />
                }
              />

              <SummaryCard
                title="Out of Stock"
                value={String(
                  outOfStock
                )}
                subtitle="Ingredients currently at zero"
                danger={
                  outOfStock > 0
                }
                icon={
                  <Package
                    size={21}
                  />
                }
              />

            </section>

            {/* =================================================
                SEARCH
            ================================================= */}

            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

              <div className="relative">

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
                  placeholder="Search ingredients..."
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-lime-400 focus:ring-4 focus:ring-lime-100"
                />

              </div>

            </section>

            {/* =================================================
                INGREDIENT LIST
            ================================================= */}

            <section className="mt-6">

              <div className="mb-4">

                <h2 className="text-xl font-black">
                  Holding Stock
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter stock received and save it into the current holding quantity.
                </p>

              </div>

              {filteredStock.length ===
              0 ? (

                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">

                  <Package
                    size={35}
                    className="mx-auto text-slate-300"
                  />

                  <h3 className="mt-4 font-black">
                    No ingredients found
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Try another search or add a new ingredient.
                  </p>

                </div>

              ) : (

                <div className="grid gap-4 xl:grid-cols-2">

                  {filteredStock.map(
                    (item) => (

                      <StockCard
                        key={
                          item.id
                        }
                        item={
                          item
                        }
                        inputValue={
                          stockInputs[
                            item.id
                          ] || ""
                        }
                        onInputChange={
                          updateStockInput
                        }
                        onIncrease={
                          increaseInput
                        }
                        onDecrease={
                          decreaseInput
                        }
                        onSave={
                          saveStock
                        }
                        onDelete={
                          deleteIngredient
                        }
                      />

                    )
                  )}

                </div>

              )}

            </section>

            {/* =================================================
                WORKFLOW
            ================================================= */}

            <section className="mt-8 rounded-2xl border border-zinc-800 bg-[#181818] p-5 text-white shadow-sm sm:p-6">

              <p className="text-xs font-black uppercase tracking-[0.18em] text-lime-400">
                GenZ Kitchen Stock Flow
              </p>

              <h2 className="mt-2 text-xl font-black">
                Holding stock feeds your trading day
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">
                Stock saved here becomes your current holding stock.
                Start of Day will use these quantities as the proposed
                opening quantities before trading begins.
              </p>

              <div className="mt-5 grid gap-3 md:grid-cols-5">

                <WorkflowBox
                  number="01"
                  title="Stock"
                  text="Receive ingredients"
                  active
                />

                <WorkflowBox
                  number="02"
                  title="Start Day"
                  text="Confirm opening"
                />

                <WorkflowBox
                  number="03"
                  title="Operations"
                  text="Sales use recipes"
                />

                <WorkflowBox
                  number="04"
                  title="End Day"
                  text="Count & reconcile"
                />

                <WorkflowBox
                  number="05"
                  title="History"
                  text="Save final record"
                />

              </div>

            </section>

            <footer className="mt-8 border-t border-slate-300 py-6">
              <p className="text-xs font-semibold text-slate-400">
                GenZ Kitchen • Stock Management
              </p>
            </footer>

          </div>

        </div>
      </div>

      {/* =====================================================
          ADD INGREDIENT MODAL
      ===================================================== */}

      {addIngredientOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center">

          <button
            type="button"
            aria-label="Close"
            onClick={() =>
              setAddIngredientOpen(
                false
              )
            }
            className="absolute inset-0"
          />

          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">

            <div className="flex items-start justify-between gap-4">

              <div>

                <p className="text-xs font-black uppercase tracking-[0.18em] text-lime-700">
                  Inventory
                </p>

                <h2 className="mt-1 text-2xl font-black">
                  Add Ingredient
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Create a new ingredient that GenZ Kitchen needs to track.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setAddIngredientOpen(
                    false
                  )
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600"
              >
                <X
                  size={18}
                />
              </button>

            </div>

            {/* NAME */}

            <div className="mt-6">

              <label className="text-sm font-black">
                Ingredient Name
              </label>

              <input
                type="text"
                value={
                  ingredientName
                }
                onChange={(e) =>
                  setIngredientName(
                    e.target.value
                  )
                }
                placeholder="e.g. Cheese Sauce"
                className="mt-2 h-12 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-lime-400 focus:ring-4 focus:ring-lime-100"
              />

            </div>

            {/* UNIT */}

            <div className="mt-4">

              <label className="text-sm font-black">
                Measurement Unit
              </label>

              <select
                value={
                  ingredientUnit
                }
                onChange={(e) =>
                  setIngredientUnit(
                    e.target.value
                  )
                }
                className="mt-2 h-12 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-lime-400"
              >
                <option value="units">
                  Units
                </option>

                <option value="portions">
                  Portions
                </option>

                <option value="patties">
                  Patties
                </option>

                <option value="wings">
                  Wings
                </option>

                <option value="rolls">
                  Rolls
                </option>

                <option value="wraps">
                  Wraps
                </option>

                <option value="packs">
                  Packs
                </option>

                <option value="bottles">
                  Bottles
                </option>

                <option value="kg">
                  Kilograms
                </option>

                <option value="grams">
                  Grams
                </option>

                <option value="litres">
                  Litres
                </option>

                <option value="ml">
                  Millilitres
                </option>
              </select>

            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">

              {/* LOW STOCK */}

              <div>

                <label className="text-sm font-black">
                  Low Stock Warning
                </label>

                <input
                  type="number"
                  min="0"
                  value={
                    ingredientLowLevel
                  }
                  onChange={(e) =>
                    setIngredientLowLevel(
                      e.target.value
                    )
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 font-bold outline-none focus:border-lime-400"
                />

              </div>

              {/* STARTING */}

              <div>

                <label className="text-sm font-black">
                  Starting Quantity
                </label>

                <input
                  type="number"
                  min="0"
                  value={
                    ingredientStartingQuantity
                  }
                  onChange={(e) =>
                    setIngredientStartingQuantity(
                      e.target.value
                    )
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 font-bold outline-none focus:border-lime-400"
                />

              </div>

            </div>

            <button
              type="button"
              onClick={
                addIngredient
              }
              disabled={
                !ingredientName.trim()
              }
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-4 font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            >
              <Plus
                size={18}
              />

              Add Ingredient
            </button>

          </div>

        </div>
      )}

    </main>
  );
}

/* =========================================================
   STOCK CARD
========================================================= */

function StockCard({
  item,
  inputValue,
  onInputChange,
  onIncrease,
  onDecrease,
  onSave,
  onDelete,
}: {
  item: StockItem;
  inputValue: string;

  onInputChange: (
    id: string,
    value: string
  ) => void;

  onIncrease: (
    id: string
  ) => void;

  onDecrease: (
    id: string
  ) => void;

  onSave: (
    item: StockItem
  ) => void;

  onDelete: (
    item: StockItem
  ) => void;
}) {
  const out =
    item.holding <= 0;

  const low =
    !out &&
    item.holding <=
      item.lowStockLevel;

  const quantity =
    Number(
      inputValue || 0
    );

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* TOP */}

      <div className="flex items-start justify-between gap-4 p-5">

        <div className="flex min-w-0 items-start gap-4">

          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
              out
                ? "bg-red-50 text-red-600"
                : low
                ? "bg-yellow-100 text-yellow-700"
                : "bg-lime-100 text-lime-700"
            }`}
          >
            <Package
              size={21}
            />
          </div>

          <div className="min-w-0">

            <h3 className="truncate font-black text-slate-950">
              {item.name}
            </h3>

            <p className="mt-1 text-xs font-semibold text-slate-400">
              Low stock warning at{" "}
              {item.lowStockLevel}{" "}
              {item.unit}
            </p>

          </div>

        </div>

        <button
          type="button"
          onClick={() =>
            onDelete(item)
          }
          title="Remove ingredient"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-300 transition hover:bg-red-50 hover:text-red-600"
        >
          <Trash2
            size={17}
          />
        </button>

      </div>

      {/* CURRENT HOLDING */}

      <div className="border-y border-slate-100 bg-slate-50 px-5 py-4">

        <div className="flex items-end justify-between gap-3">

          <div>

            <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
              Current Holding
            </p>

            <div className="mt-1 flex items-baseline gap-2">

              <span className="text-3xl font-black tracking-tight">
                {item.holding}
              </span>

              <span className="text-sm font-bold text-slate-400">
                {item.unit}
              </span>

            </div>

          </div>

          <StockStatus
            out={out}
            low={low}
          />

        </div>

      </div>

      {/* ADD STOCK */}

      <div className="p-5">

        <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
          Add Stock
        </p>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row">

          <div className="flex h-12 flex-1 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">

            <button
              type="button"
              onClick={() =>
                onDecrease(
                  item.id
                )
              }
              className="flex w-12 shrink-0 items-center justify-center border-r border-slate-200 text-slate-500 transition hover:bg-slate-100"
            >
              <Minus
                size={17}
              />
            </button>

            <input
              type="number"
              min="0"
              inputMode="decimal"
              value={
                inputValue
              }
              onChange={(e) =>
                onInputChange(
                  item.id,
                  e.target.value
                )
              }
              placeholder="0"
              className="min-w-0 flex-1 bg-transparent px-3 text-center font-black outline-none"
            />

            <button
              type="button"
              onClick={() =>
                onIncrease(
                  item.id
                )
              }
              className="flex w-12 shrink-0 items-center justify-center border-l border-slate-200 text-slate-500 transition hover:bg-slate-100"
            >
              <Plus
                size={17}
              />
            </button>

          </div>

          <button
            type="button"
            onClick={() =>
              onSave(item)
            }
            disabled={
              !Number.isFinite(
                quantity
              ) ||
              quantity <= 0
            }
            className="h-12 rounded-xl bg-slate-950 px-6 text-sm font-black text-white transition hover:bg-lime-400 hover:text-black disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            Save Stock
          </button>

        </div>

        {quantity > 0 && (
          <div className="mt-3 rounded-xl bg-lime-50 px-4 py-3 text-xs font-bold text-lime-800">

            {item.holding}{" "}
            + {quantity}{" "}
            ={" "}
            <span className="font-black">
              {item.holding +
                quantity}{" "}
              {item.unit}
            </span>

          </div>
        )}

      </div>

    </article>
  );
}

/* =========================================================
   STOCK STATUS
========================================================= */

function StockStatus({
  out,
  low,
}: {
  out: boolean;
  low: boolean;
}) {
  if (out) {
    return (
      <span className="rounded-full bg-red-100 px-3 py-1.5 text-xs font-black text-red-700">
        Out of Stock
      </span>
    );
  }

  if (low) {
    return (
      <span className="rounded-full bg-yellow-100 px-3 py-1.5 text-xs font-black text-yellow-800">
        Low Stock
      </span>
    );
  }

  return (
    <span className="rounded-full bg-lime-100 px-3 py-1.5 text-xs font-black text-lime-800">
      In Stock
    </span>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  warning = false,
  danger = false,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  warning?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="mb-5 flex items-start justify-between">

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${
            danger
              ? "bg-red-50 text-red-600"
              : warning
              ? "bg-yellow-100 text-yellow-700"
              : "bg-lime-100 text-lime-700"
          }`}
        >
          {icon}
        </div>

        <span
          className={`h-2.5 w-2.5 rounded-full ${
            danger
              ? "bg-red-500"
              : warning
              ? "bg-yellow-400"
              : "bg-lime-400"
          }`}
        />

      </div>

      <p className="text-sm font-bold text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-black tracking-tight">
        {value}
      </p>

      <p className="mt-2 text-xs font-semibold text-slate-400">
        {subtitle}
      </p>

    </div>
  );
}

/* =========================================================
   WORKFLOW BOX
========================================================= */

function WorkflowBox({
  number,
  title,
  text,
  active = false,
}: {
  number: string;
  title: string;
  text: string;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        active
          ? "border-lime-400 bg-lime-400 text-black"
          : "border-zinc-800 bg-zinc-900"
      }`}
    >
      <p
        className={`text-[10px] font-black uppercase tracking-[0.15em] ${
          active
            ? "text-black/60"
            : "text-zinc-600"
        }`}
      >
        {number}
      </p>

      <p
        className={`mt-2 font-black ${
          active
            ? "text-black"
            : "text-white"
        }`}
      >
        {title}
      </p>

      <p
        className={`mt-1 text-xs ${
          active
            ? "text-black/70"
            : "text-zinc-500"
        }`}
      >
        {text}
      </p>

    </div>
  );
}