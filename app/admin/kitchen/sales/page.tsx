"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Loader2,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  XCircle,
} from "lucide-react";

type Product = {
  id: string;
  name: string;
  price: number;
};

type CartItem = Product & {
  quantity: number;
};

type PaymentMethod = "cash" | "eft" | "website";

const products: Product[] = [
  {
    id: "zungu",
    name: "Give Me Zungu Burger",
    price: 59,
  },
  {
    id: "matla-thata-burger",
    name: "Matla Thata Burger",
    price: 95,
  },
  {
    id: "single-and-mingle",
    name: "Single & Mingle Burger",
    price: 35,
  },
  {
    id: "bacon-bite-hotdog",
    name: "Bacon Bite Hotdog",
    price: 55,
  },
  {
    id: "cheesy-mince-loaded-hotdog",
    name: "Cheesy Mince Loaded Hotdog",
    price: 89,
  },
  {
    id: "chicken-quesadillas",
    name: "2 Chicken Quesadillas",
    price: 85,
  },
  {
    id: "crunch-box-wrap",
    name: "Crunch Box Chicken Wrap",
    price: 59,
  },
  {
    id: "kasi-wrap-small",
    name: "Kasi Styled Wrap (Small)",
    price: 35,
  },
  {
    id: "kasi-wrap-medium",
    name: "Kasi Styled Wrap (Medium)",
    price: 55,
  },
  {
    id: "kasi-wrap-large",
    name: "Kasi Styled Wrap (Large)",
    price: 75,
  },
  {
    id: "kasi-wrap-xl",
    name: "Kasi Styled Wrap (Extra Large)",
    price: 95,
  },
  {
    id: "sticky-wings-5",
    name: "Mama's Sticky Wings - 5 + Chips",
    price: 59,
  },
  {
    id: "sticky-wings-10",
    name: "Mama's Sticky Wings - 10 + Chips",
    price: 110,
  },
  {
    id: "small-chips-meal",
    name: "Small Chips in a Meal",
    price: 10,
  },
  {
    id: "small-chips-alone",
    name: "Small Chips Alone",
    price: 20,
  },
  {
    id: "street-tacos",
    name: "Kasi Flamed Street-Style Tacos",
    price: 75,
  },
  {
    id: "cheesy-jalapeno-fries",
    name: "Cheesy Jalapeno Fries",
    price: 45,
  },
  {
    id: "lunch-box-meal",
    name: "Lunch Box Meal",
    price: 35,
  },
  {
    id: "bundle-of-joy",
    name: "Bundle of Joy",
    price: 90,
  },
  {
    id: "sprite",
    name: "Sprite",
    price: 19,
  },
  {
    id: "coke",
    name: "Coke",
    price: 19,
  },
  {
    id: "fanta-orange",
    name: "Fanta Orange",
    price: 19,
  },
];

function money(
  value: number | string | null | undefined
) {
  const amount = Number(value || 0);

  return `R${amount.toFixed(2)}`;
}

export default function SalesPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("cash");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  /* =======================================================
     TOTAL
  ======================================================= */

  const total = useMemo(() => {
    return cart.reduce(
      (sum, item) =>
        sum + item.price * item.quantity,
      0
    );
  }, [cart]);

  const totalItems = useMemo(() => {
    return cart.reduce(
      (sum, item) =>
        sum + item.quantity,
      0
    );
  }, [cart]);

  /* =======================================================
     ADD PRODUCT
  ======================================================= */

  function addProduct(product: Product) {
    setError("");
    setSuccessMessage("");

    setCart((current) => {
      const existing =
        current.find(
          (item) =>
            item.id === product.id
        );

      if (existing) {
        return current.map(
          (item) =>
            item.id === product.id
              ? {
                  ...item,
                  quantity:
                    item.quantity + 1,
                }
              : item
        );
      }

      return [
        ...current,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  }

  /* =======================================================
     INCREASE
  ======================================================= */

  function increaseQuantity(id: string) {
    setCart((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      )
    );
  }

  /* =======================================================
     DECREASE
  ======================================================= */

  function decreaseQuantity(id: string) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) =>
            item.quantity > 0
        )
    );
  }

  /* =======================================================
     REMOVE
  ======================================================= */

  function removeItem(id: string) {
    setCart((current) =>
      current.filter(
        (item) =>
          item.id !== id
      )
    );
  }

  /* =======================================================
     CLEAR
  ======================================================= */

  function clearOrder() {
    setCart([]);
    setError("");
    setSuccessMessage("");
    setPaymentMethod("cash");
  }

  /* =======================================================
     CONFIRM MANUAL POS SALE

     IMPORTANT:
     This page calls:

     POST /api/sale

     Which maps to:

     app/api/sale/route.ts
  ======================================================= */

  async function confirmSale() {
    if (cart.length === 0) {
      setError(
        "Please select at least one product."
      );

      return;
    }

    if (loading) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const saleItems =
        cart.map((item) => ({
          product_id:
            item.id,

          product_name:
            item.name,

          quantity:
            item.quantity,

          price:
            item.price,
        }));

      /*
       * IMPORTANT
       *
       * app/api/sale/route.ts
       * becomes:
       *
       * /api/sale
       */

      const response =
        await fetch(
          "/api/sales",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              paymentMethod,
              items: saleItems,
            }),
          }
        );

      const contentType =
        response.headers.get(
          "content-type"
        ) || "";

      if (
        !contentType.includes(
          "application/json"
        )
      ) {
        const responseText =
          await response.text();

        console.error(
          "POS sale API returned non JSON:",
          responseText
        );

        throw new Error(
          `POS sale API returned ${response.status}.`
        );
      }

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            `Unable to record sale (${response.status}).`
        );
      }

      setSuccessMessage(
        `Sale recorded successfully. Total: ${money(
          data?.total ?? total
        )}`
      );

      setCart([]);

      setPaymentMethod(
        "cash"
      );
    } catch (err) {
      console.error(
        "Confirm sale error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to record the sale."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-100">
      <div className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
        {/* ===============================================
            HEADER
        =============================================== */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin/kitchen"
              className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-black"
            >
              <ArrowLeft
                size={18}
              />

              Back to Kitchen
            </Link>

            <p className="text-xs font-black uppercase tracking-[0.2em] text-lime-600">
              Manual Sale
            </p>

            <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Kitchen POS
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Select products, choose the
              payment method and confirm
              the sale.
            </p>
          </div>

          <div className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:w-auto sm:px-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black text-lime-400">
              <ShoppingCart
                size={20}
              />
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Basket
              </p>

              <p className="text-sm font-black text-slate-900">
                {totalItems}{" "}
                {totalItems === 1
                  ? "item"
                  : "items"}
              </p>
            </div>
          </div>
        </div>

        {/* ===============================================
            SUCCESS
        =============================================== */}

        {successMessage && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-800">
            <CheckCircle2
              size={20}
              className="mt-0.5 shrink-0"
            />

            <p className="text-sm font-bold">
              {successMessage}
            </p>
          </div>
        )}

        {/* ===============================================
            ERROR
        =============================================== */}

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            <XCircle
              size={20}
              className="mt-0.5 shrink-0"
            />

            <p className="break-words text-sm font-bold">
              {error}
            </p>
          </div>
        )}

        {/* ===============================================
            POS
        =============================================== */}

        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          {/* =============================================
              PRODUCTS
          ============================================= */}

          <section>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 xl:grid-cols-3">
              {products.map(
                (product) => {
                  const cartItem =
                    cart.find(
                      (item) =>
                        item.id ===
                        product.id
                    );

                  return (
                    <button
                      key={
                        product.id
                      }
                      type="button"
                      disabled={
                        loading
                      }
                      onClick={() =>
                        addProduct(
                          product
                        )
                      }
                      className="relative min-h-[135px] overflow-hidden rounded-2xl border-2 border-lime-500 bg-lime-500 p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:bg-lime-400 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-[160px] sm:rounded-3xl sm:p-5"
                    >
                      {cartItem && (
                        <div className="absolute right-2 top-2 flex h-8 min-w-8 items-center justify-center rounded-full bg-black px-2 text-xs font-black text-lime-400 sm:right-4 sm:top-4">
                          {
                            cartItem.quantity
                          }
                        </div>
                      )}

                      <div className="flex h-full flex-col justify-between">
                        <h3 className="max-w-[80%] text-sm font-black leading-tight text-black sm:text-lg">
                          {
                            product.name
                          }
                        </h3>

                        <div>
                          <p className="text-2xl font-black tracking-tight text-black sm:text-3xl">
                            R
                            {
                              product.price
                            }
                          </p>

                          <p className="mt-1 text-[9px] font-black uppercase tracking-wider text-black/60 sm:text-xs">
                            Tap to add
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          </section>

          {/* =============================================
              CHECKOUT
          ============================================= */}

          <aside>
            <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-black text-white shadow-xl sm:rounded-3xl lg:sticky lg:top-6">
              <div className="border-b border-zinc-800 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-lime-400">
                      Checkout
                    </p>

                    <h2 className="mt-1 text-xl font-black sm:text-2xl">
                      POS Basket
                    </h2>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lime-400 text-black">
                    <ShoppingCart
                      size={20}
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5">
                {/* CART */}

                {cart.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-zinc-700 p-10 text-center">
                    <ShoppingCart
                      size={30}
                      className="mx-auto text-lime-400"
                    />

                    <p className="mt-3 font-black">
                      Basket empty
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      Select a product
                      to begin.
                    </p>
                  </div>
                ) : (
                  <div className="max-h-[350px] space-y-3 overflow-y-auto pr-1">
                    {cart.map(
                      (item) => (
                        <div
                          key={
                            item.id
                          }
                          className="rounded-2xl border border-zinc-800 bg-zinc-950 p-3"
                        >
                          <div className="flex justify-between gap-3">
                            <div className="min-w-0">
                              <p className="break-words text-sm font-black">
                                {
                                  item.name
                                }
                              </p>

                              <p className="mt-1 text-xs text-zinc-500">
                                {money(
                                  item.price
                                )}{" "}
                                each
                              </p>
                            </div>

                            <button
                              type="button"
                              disabled={
                                loading
                              }
                              onClick={() =>
                                removeItem(
                                  item.id
                                )
                              }
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                              aria-label={`Remove ${item.name}`}
                            >
                              <Trash2
                                size={
                                  18
                                }
                              />
                            </button>
                          </div>

                          <div className="mt-4 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                disabled={
                                  loading
                                }
                                onClick={() =>
                                  decreaseQuantity(
                                    item.id
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 transition hover:bg-zinc-800 disabled:opacity-50"
                                aria-label={`Decrease ${item.name}`}
                              >
                                <Minus
                                  size={
                                    16
                                  }
                                />
                              </button>

                              <span className="flex h-9 min-w-10 items-center justify-center rounded-xl bg-lime-400 px-2 font-black text-black">
                                {
                                  item.quantity
                                }
                              </span>

                              <button
                                type="button"
                                disabled={
                                  loading
                                }
                                onClick={() =>
                                  increaseQuantity(
                                    item.id
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 transition hover:bg-zinc-800 disabled:opacity-50"
                                aria-label={`Increase ${item.name}`}
                              >
                                <Plus
                                  size={
                                    16
                                  }
                                />
                              </button>
                            </div>

                            <p className="shrink-0 font-black text-lime-400">
                              {money(
                                item.price *
                                  item.quantity
                              )}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}

                {/* TOTAL */}

                <div className="mt-5 rounded-2xl bg-zinc-950 p-4">
                  <div className="flex justify-between text-sm text-zinc-500">
                    <span>
                      Items
                    </span>

                    <span className="font-black text-white">
                      {totalItems}
                    </span>
                  </div>

                  <div className="my-3 h-px bg-zinc-800" />

                  <div className="flex items-end justify-between gap-3">
                    <p className="text-xs font-black uppercase tracking-widest text-zinc-500">
                      Total
                    </p>

                    <p className="shrink-0 text-3xl font-black tracking-tight text-lime-400 sm:text-4xl">
                      {money(
                        total
                      )}
                    </p>
                  </div>
                </div>

                {/* PAYMENT */}

                <div className="mt-5">
                  <div className="mb-2 flex items-center gap-2">
                    <CreditCard
                      size={16}
                    />

                    <p className="text-sm font-black">
                      Payment Method
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    {(
                      [
                        "cash",
                        "eft",
                        "website",
                      ] as PaymentMethod[]
                    ).map(
                      (method) => (
                        <button
                          key={
                            method
                          }
                          type="button"
                          disabled={
                            loading
                          }
                          onClick={() =>
                            setPaymentMethod(
                              method
                            )
                          }
                          className={`rounded-xl border px-1 py-3 text-[10px] font-black uppercase transition sm:text-xs ${
                            paymentMethod ===
                            method
                              ? "border-lime-400 bg-lime-400 text-black"
                              : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-600"
                          }`}
                        >
                          {method}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* CONFIRM */}

                <button
                  type="button"
                  onClick={
                    confirmSale
                  }
                  disabled={
                    loading ||
                    cart.length ===
                      0
                  }
                  className="mt-5 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-lime-400 px-4 py-4 font-black text-black transition hover:bg-lime-300 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
                >
                  {loading ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />

                      Saving Sale...
                    </>
                  ) : (
                    <>
                      <CheckCircle2
                        size={18}
                      />

                      Confirm Sale
                    </>
                  )}
                </button>

                {/* CLEAR */}

                {cart.length >
                  0 && (
                  <button
                    type="button"
                    onClick={
                      clearOrder
                    }
                    disabled={
                      loading
                    }
                    className="mt-2 w-full rounded-2xl border border-zinc-800 px-4 py-3 text-sm font-bold text-zinc-400 transition hover:border-zinc-600 hover:text-white disabled:opacity-50"
                  >
                    Clear Basket
                  </button>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}