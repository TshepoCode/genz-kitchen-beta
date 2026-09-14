"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  Banknote,
  ChefHat,
  CircleDollarSign,
  ClipboardCheck,
  CreditCard,
  History,
  LayoutDashboard,
  Menu,
  Package,
  Plus,
  Receipt,
  ShoppingCart,
  Trash2,
  TrendingDown,
  TrendingUp,
  WalletCards,
  X,
} from "lucide-react";

type Expense = {
  id: string;
  category: string;
  description: string;
  amount: number;

  expense_type:
    | "operating"
    | "repayment"
    | "staff"
    | "other";

  payment_method: string;
  branch: string;
  created_at: string;
};

type ExpenseCategory = {
  name: string;

  type:
    | "operating"
    | "repayment"
    | "staff"
    | "other";
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

const expenseCategories: ExpenseCategory[] = [
  {
    name: "Stock Purchase",
    type: "operating",
  },
  {
    name: "Gas Refill",
    type: "operating",
  },
  {
    name: "Petrol / Transport",
    type: "operating",
  },
  {
    name: "Event Payment",
    type: "operating",
  },
  {
    name: "Packaging",
    type: "operating",
  },
  {
    name: "Electricity",
    type: "operating",
  },
  {
    name: "Water",
    type: "operating",
  },
  {
    name: "Delivery Cost",
    type: "operating",
  },
  {
    name: "Equipment",
    type: "operating",
  },
  {
    name: "Repairs / Maintenance",
    type: "operating",
  },
  {
    name: "Cleaning",
    type: "operating",
  },
  {
    name: "Marketing",
    type: "operating",
  },
  {
    name: "Rent",
    type: "operating",
  },
  {
    name: "Investor Repayment",
    type: "repayment",
  },
  {
    name: "Staff Payment",
    type: "staff",
  },
  {
    name: "Other",
    type: "other",
  },
];

export default function ExpensesPage() {
  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  const [
    expenses,
    setExpenses,
  ] = useState<Expense[]>([]);

  const [
    grossSales,
    setGrossSales,
  ] = useState(0);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    deletingId,
    setDeletingId,
  ] = useState<
    string | null
  >(null);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const [
    category,
    setCategory,
  ] = useState(
    "Stock Purchase"
  );

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    amount,
    setAmount,
  ] = useState("");

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState("cash");

  const [
    branch,
    setBranch,
  ] = useState("Kagiso");

  /* =====================================
     CALCULATIONS
  ===================================== */

  const operatingExpenses =
    useMemo(() => {
      return expenses
        .filter(
          (expense) =>
            expense.expense_type ===
            "operating"
        )
        .reduce(
          (sum, expense) =>
            sum +
            Number(
              expense.amount || 0
            ),
          0
        );
    }, [expenses]);

  const investorRepayments =
    useMemo(() => {
      return expenses
        .filter(
          (expense) =>
            expense.expense_type ===
            "repayment"
        )
        .reduce(
          (sum, expense) =>
            sum +
            Number(
              expense.amount || 0
            ),
          0
        );
    }, [expenses]);

  const staffPayments =
    useMemo(() => {
      return expenses
        .filter(
          (expense) =>
            expense.expense_type ===
            "staff"
        )
        .reduce(
          (sum, expense) =>
            sum +
            Number(
              expense.amount || 0
            ),
          0
        );
    }, [expenses]);

  const otherExpenses =
    useMemo(() => {
      return expenses
        .filter(
          (expense) =>
            expense.expense_type ===
            "other"
        )
        .reduce(
          (sum, expense) =>
            sum +
            Number(
              expense.amount || 0
            ),
          0
        );
    }, [expenses]);

  const totalExpenses =
    operatingExpenses +
    investorRepayments +
    staffPayments +
    otherExpenses;

  const netSales =
    grossSales -
    totalExpenses;

  /* =====================================
     LOAD DATA
  ===================================== */

  const loadData =
    useCallback(
      async () => {
        try {
          setLoading(true);
          setError("");

          const [
            expenseResponse,
            salesResponse,
          ] =
            await Promise.all([
              fetch(
                "/api/kitchen/expenses",
                {
                  cache:
                    "no-store",
                }
              ),

              fetch(
                "/api/kitchen/today",
                {
                  cache:
                    "no-store",
                }
              ),
            ]);

          const expenseData =
            await expenseResponse.json();

          const salesData =
            await salesResponse.json();

          if (
            !expenseResponse.ok
          ) {
            throw new Error(
              expenseData.error ||
                "Failed to load expenses."
            );
          }

          if (
            !salesResponse.ok
          ) {
            throw new Error(
              salesData.error ||
                "Failed to load today's sales."
            );
          }

          setExpenses(
            expenseData.expenses ||
              []
          );

          setGrossSales(
            Number(
              salesData
                ?.summary
                ?.sales || 0
            )
          );
        } catch (err) {
          console.error(
            "Expenses load error:",
            err
          );

          setError(
            err instanceof Error
              ? err.message
              : "Failed to load data."
          );
        } finally {
          setLoading(false);
        }
      },
      []
    );

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* =====================================
     HELPERS
  ===================================== */

  function money(
    value: number
  ) {
    return `R${Number(
      value || 0
    ).toFixed(2)}`;
  }

  function formatTime(
    date: string
  ) {
    return new Intl.DateTimeFormat(
      "en-ZA",
      {
        timeZone:
          "Africa/Johannesburg",

        hour:
          "2-digit",

        minute:
          "2-digit",

        hour12:
          false,
      }
    ).format(
      new Date(date)
    );
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

  function typeLabel(
    type: Expense["expense_type"]
  ) {
    if (
      type === "operating"
    ) {
      return "Operating";
    }

    if (
      type === "repayment"
    ) {
      return "Investor";
    }

    if (
      type === "staff"
    ) {
      return "Staff";
    }

    return "Other";
  }

  /* =====================================
     ADD EXPENSE
  ===================================== */

  async function addExpense(
    event: FormEvent
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const expenseAmount =
      Number(amount);

    if (
      !description.trim()
    ) {
      setError(
        "Please enter a description."
      );

      return;
    }

    if (
      Number.isNaN(
        expenseAmount
      ) ||
      expenseAmount <= 0
    ) {
      setError(
        "Enter a valid expense amount."
      );

      return;
    }

    const selectedCategory =
      expenseCategories.find(
        (item) =>
          item.name ===
          category
      );

    const expenseType =
      selectedCategory?.type ||
      "other";

    try {
      setSaving(true);

      const response =
        await fetch(
          "/api/kitchen/expenses",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              category,

              description:
                description.trim(),

              amount:
                expenseAmount,

              expenseType,

              paymentMethod,

              branch,
            }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Failed to save expense."
        );
      }

      setExpenses(
        (current) => [
          result.expense,
          ...current,
        ]
      );

      setDescription("");
      setAmount("");

      setSuccess(
        `${category} of ${money(
          expenseAmount
        )} added.`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save expense."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =====================================
     DELETE
  ===================================== */

  async function deleteExpense(
    expenseId: string
  ) {
    try {
      setDeletingId(
        expenseId
      );

      setError("");
      setSuccess("");

      const response =
        await fetch(
          `/api/kitchen/expenses?id=${expenseId}`,
          {
            method:
              "DELETE",
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Failed to delete expense."
        );
      }

      setExpenses(
        (current) =>
          current.filter(
            (expense) =>
              expense.id !==
              expenseId
          )
      );

      setSuccess(
        "Expense deleted."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete expense."
      );
    } finally {
      setDeletingId(
        null
      );
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#eef0f2]">
        <p className="font-black text-slate-900">
          Loading expenses...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#eef0f2] text-slate-950">
      <div className="flex min-h-screen">

        {/* ===============================
            DESKTOP SIDEBAR
        =============================== */}

        <aside className="hidden w-[230px] shrink-0 border-r border-zinc-800 bg-[#151515] lg:flex lg:flex-col">

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
                  "Expenses";

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

              <p className="text-xs font-black uppercase tracking-wider text-lime-400">
                Net Remaining
              </p>

              <p
                className={`mt-2 text-xl font-black ${
                  netSales >= 0
                    ? "text-white"
                    : "text-red-400"
                }`}
              >
                {money(
                  netSales
                )}
              </p>

              <p className="mt-2 text-xs text-zinc-500">
                Gross sales minus all recorded payments.
              </p>

            </div>
          </div>

        </aside>

        {/* ===============================
            MAIN
        =============================== */}

        <div className="min-w-0 flex-1">

          {/* TOP BAR */}

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
                >
                  <Menu
                    size={20}
                  />
                </button>

                <div className="hidden lg:block">

                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    GenZ Kitchen
                  </p>

                  <p className="font-black">
                    Expenses
                  </p>

                </div>

              </div>

              <Link
                href="/admin/kitchen"
                className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white"
              >
                Dashboard
              </Link>

            </div>

          </header>

          {/* MOBILE MENU */}

          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">

              <button
                type="button"
                onClick={() =>
                  setMobileMenuOpen(
                    false
                  )
                }
                className="absolute inset-0 bg-black/60"
              />

              <div className="relative h-full w-[280px] bg-[#151515] p-4">

                <div className="mb-6 flex items-center justify-between">

                  <p className="font-black text-white">
                    GenZKitchen
                  </p>

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
                        "Expenses";

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
                              : "text-zinc-400"
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

          {/* PAGE */}

          <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">

            {/* TITLE */}

            <section className="mb-6">

              <p className="text-xs font-black uppercase tracking-[0.18em] text-lime-700">
                Finance
              </p>

              <h1 className="mt-1 text-3xl font-black">
                Daily Expenses
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                {todayLabel()}
              </p>

            </section>

            {/* MESSAGES */}

            {error && (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-5 rounded-2xl border border-lime-300 bg-lime-100 p-4 text-sm font-bold text-lime-900">
                {success}
              </div>
            )}

            {/* ===============================
                FINANCE SUMMARY
            =============================== */}

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

              <FinanceCard
                title="Gross Sales"
                value={money(
                  grossSales
                )}
                icon={
                  <TrendingUp
                    size={20}
                  />
                }
              />

              <FinanceCard
                title="Operating"
                value={`-${money(
                  operatingExpenses
                )}`}
                icon={
                  <TrendingDown
                    size={20}
                  />
                }
                danger
              />

              <FinanceCard
                title="Investor"
                value={`-${money(
                  investorRepayments
                )}`}
                icon={
                  <WalletCards
                    size={20}
                  />
                }
                danger
              />

              <FinanceCard
                title="Staff"
                value={`-${money(
                  staffPayments
                )}`}
                icon={
                  <Banknote
                    size={20}
                  />
                }
                danger
              />

              <FinanceCard
                title="Net Remaining"
                value={money(
                  netSales
                )}
                icon={
                  <CircleDollarSign
                    size={20}
                  />
                }
                highlight
              />

            </section>

            {/* ===============================
                MAIN AREA
            =============================== */}

            <section className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.3fr]">

              {/* ADD EXPENSE */}

              <form
                onSubmit={
                  addExpense
                }
                className="rounded-2xl border border-zinc-800 bg-[#181818] p-5 text-white sm:p-6"
              >

                <p className="text-xs font-black uppercase tracking-[0.18em] text-lime-400">
                  New Expense
                </p>

                <h2 className="mt-1 text-xl font-black">
                  Add Payment
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Record business money leaving the kitchen.
                </p>

                <div className="mt-6 space-y-5">

                  {/* CATEGORY */}

                  <div>

                    <label className="text-sm font-bold">
                      Category
                    </label>

                    <select
                      value={
                        category
                      }
                      onChange={(e) =>
                        setCategory(
                          e.target.value
                        )
                      }
                      className="mt-2 h-12 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 font-semibold text-white outline-none focus:border-lime-400"
                    >

                      {expenseCategories.map(
                        (item) => (
                          <option
                            key={
                              item.name
                            }
                            value={
                              item.name
                            }
                          >
                            {
                              item.name
                            }
                          </option>
                        )
                      )}

                    </select>

                  </div>

                  {/* AUTO TYPE */}

                  <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-4">

                    <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                      Expense Type
                    </p>

                    <p className="mt-1 font-black text-lime-400">
                      {typeLabel(
                        expenseCategories.find(
                          (item) =>
                            item.name ===
                            category
                        )?.type ||
                          "other"
                      )}
                    </p>

                  </div>

                  {/* DESCRIPTION */}

                  <div>

                    <label className="text-sm font-bold">
                      Description
                    </label>

                    <input
                      value={
                        description
                      }
                      onChange={(e) =>
                        setDescription(
                          e.target.value
                        )
                      }
                      placeholder="e.g. Gas refill at Total"
                      className="mt-2 h-12 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 outline-none placeholder:text-zinc-600 focus:border-lime-400"
                    />

                  </div>

                  {/* AMOUNT */}

                  <div>

                    <label className="text-sm font-bold">
                      Amount
                    </label>

                    <div className="relative mt-2">

                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-zinc-500">
                        R
                      </span>

                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={
                          amount
                        }
                        onChange={(e) =>
                          setAmount(
                            e.target.value
                          )
                        }
                        placeholder="0.00"
                        className="h-14 w-full rounded-xl border border-zinc-700 bg-zinc-900 pl-9 pr-4 text-xl font-black outline-none focus:border-lime-400"
                      />

                    </div>

                  </div>

                  {/* PAYMENT METHOD */}

                  <div>

                    <label className="text-sm font-bold">
                      Paid Using
                    </label>

                    <div className="mt-2 grid grid-cols-2 gap-2">

                      {[
                        "cash",
                        "eft",
                        "card",
                        "other",
                      ].map(
                        (method) => (
                          <button
                            key={
                              method
                            }
                            type="button"
                            onClick={() =>
                              setPaymentMethod(
                                method
                              )
                            }
                            className={`rounded-xl border px-3 py-3 text-sm font-black capitalize ${
                              paymentMethod ===
                              method
                                ? "border-lime-400 bg-lime-400 text-black"
                                : "border-zinc-700 bg-zinc-900 text-zinc-400"
                            }`}
                          >
                            {
                              method
                            }
                          </button>
                        )
                      )}

                    </div>

                  </div>

                  {/* BRANCH */}

                  <div>

                    <label className="text-sm font-bold">
                      Branch
                    </label>

                    <select
                      value={
                        branch
                      }
                      onChange={(e) =>
                        setBranch(
                          e.target.value
                        )
                      }
                      className="mt-2 h-12 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-white"
                    >
                      <option value="Kagiso">
                        Kagiso
                      </option>

                      <option value="Cosmo City">
                        Cosmo City
                      </option>
                    </select>

                  </div>

                  <button
                    type="submit"
                    disabled={
                      saving
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-lime-400 px-5 py-4 font-black text-black hover:bg-lime-300 disabled:bg-zinc-700 disabled:text-zinc-400"
                  >
                    <Plus
                      size={19}
                    />

                    {saving
                      ? "Saving..."
                      : "Add Expense"}
                  </button>

                </div>

              </form>

              {/* ===============================
                  EXPENSE HISTORY
              =============================== */}

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

                <div className="mb-5 flex items-start justify-between">

                  <div>

                    <h2 className="text-xl font-black">
                      Today's Expenses
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {expenses.length} recorded payment
                      {expenses.length ===
                      1
                        ? ""
                        : "s"}
                    </p>

                  </div>

                  <p className="text-xl font-black text-red-600">
                    -
                    {money(
                      totalExpenses
                    )}
                  </p>

                </div>

                {expenses.length ===
                0 ? (

                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">

                    <Receipt className="mx-auto mb-3 text-slate-300" />

                    <p className="font-black text-slate-700">
                      No expenses recorded
                    </p>

                  </div>

                ) : (

                  <div className="overflow-hidden rounded-xl border border-slate-200">

                    {expenses.map(
                      (
                        expense,
                        index
                      ) => (

                        <div
                          key={
                            expense.id
                          }
                          className={`flex gap-4 p-4 ${
                            index !==
                            expenses.length -
                              1
                              ? "border-b border-slate-100"
                              : ""
                          }`}
                        >

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                            <Receipt
                              size={19}
                            />
                          </div>

                          <div className="min-w-0 flex-1">

                            <div className="flex flex-wrap items-center gap-2">

                              <p className="font-black">
                                {
                                  expense.description
                                }
                              </p>

                              <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black uppercase text-slate-500">
                                {
                                  expense.category
                                }
                              </span>

                              <span className="rounded-full bg-lime-100 px-2 py-1 text-[10px] font-black uppercase text-lime-800">
                                {typeLabel(
                                  expense.expense_type
                                )}
                              </span>

                            </div>

                            <p className="mt-1 text-xs font-semibold text-slate-400">
                              {formatTime(
                                expense.created_at
                              )}
                              {" • "}
                              {
                                expense.payment_method
                              }
                              {" • "}
                              {
                                expense.branch
                              }
                            </p>

                          </div>

                          <div className="text-right">

                            <p className="font-black text-red-600">
                              -
                              {money(
                                expense.amount
                              )}
                            </p>

                            <button
                              type="button"
                              disabled={
                                deletingId ===
                                expense.id
                              }
                              onClick={() =>
                                deleteExpense(
                                  expense.id
                                )
                              }
                              className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-red-600"
                            >
                              <Trash2
                                size={13}
                              />

                              Delete
                            </button>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>

            </section>

          </div>

        </div>

      </div>
    </main>
  );
}

/* ============================================================
   FINANCE CARD
============================================================ */

function FinanceCard({
  title,
  value,
  icon,
  danger = false,
  highlight = false,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  danger?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm ${
        highlight
          ? "border-zinc-800 bg-[#181818]"
          : "border-slate-200 bg-white"
      }`}
    >

      <div
        className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl ${
          highlight
            ? "bg-lime-400 text-black"
            : danger
              ? "bg-red-50 text-red-600"
              : "bg-lime-100 text-lime-700"
        }`}
      >
        {icon}
      </div>

      <p
        className={`text-sm font-bold ${
          highlight
            ? "text-zinc-400"
            : "text-slate-500"
        }`}
      >
        {title}
      </p>

      <p
        className={`mt-2 text-2xl font-black ${
          highlight
            ? "text-lime-400"
            : danger
              ? "text-red-600"
              : "text-slate-950"
        }`}
      >
        {value}
      </p>

    </div>
  );
}