"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";

type Product = {
  id: string;
  name: string;
  price: number;
};

type CartItem = Product & {
  quantity: number;
};

const products: Product[] = [
  {
    id: "zungu-chips",
    name: "Give Me Zungu + Chips",
    price: 59,
  },
  {
    id: "chicken-quesadillas",
    name: "2 Chicken Quesadillas",
    price: 85,
  },
  {
    id: "crunch-box-wrap",
    name: "Crunch Box Chicken Wrap + Chips",
    price: 59,
  },
  {
    id: "cheesy-hotdog",
    name: "Cheesy Hotdog",
    price: 55,
  },
  {
    id: "sticky-wings-5",
    name: "Mama's Sticky Wings - 5 + Chips",
    price: 89,
  },
  {
    id: "sticky-wings-10",
    name: "Mama's Sticky Wings - 10 + Chips",
    price: 159,
  },
  {
    id: "small-chips-meal",
    name: "Small Chips in a meal",
    price: 10,
  },
];

export default function SalesPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const total = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [cart]);

  const totalItems = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  }, [cart]);

  function addProduct(product: Product) {
    setError("");
    setSuccessMessage("");

    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  }

  function increaseQuantity(productId: string) {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  }

  function decreaseQuantity(productId: string) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeItem(productId: string) {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.id !== productId
      )
    );
  }

  function clearOrder() {
    setCart([]);
    setError("");
    setSuccessMessage("");
  }

  async function confirmSale() {
    if (cart.length === 0) {
      setError(
        "Please select at least one product before confirming the sale."
      );
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethod,
          items: cart.map((item) => ({
            product_id: item.id,
            product_name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to save sale."
        );
      }

      setSuccessMessage(
        `Sale recorded successfully. Total: R${Number(
          data.total
        ).toFixed(2)}`
      );

      setCart([]);
      setPaymentMethod("cash");
    } catch (err) {
      console.error("Confirm sale error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while saving the sale."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin/kitchen"
              className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-black"
            >
              <ArrowLeft size={18} />
              Back to Kitchen Dashboard
            </Link>

            <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Kitchen Sales
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Tap the products ordered by the customer,
              review the basket, then confirm the sale.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-lime-400">
              <ShoppingCart size={19} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Current Order
              </p>

              <p className="text-sm font-black text-slate-900">
                {totalItems} item
                {totalItems === 1 ? "" : "s"}
              </p>
            </div>
          </div>
        </div>

        {/* SUCCESS */}
        {successMessage && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-800">
            <CheckCircle2
              size={22}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="font-black">
                Sale complete
              </p>

              <p className="text-sm">
                {successMessage}
              </p>
            </div>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          {/* PRODUCTS */}
          <section>
            <div className="mb-4">
              <h2 className="text-xl font-black text-slate-950">
                Select Products
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Tap a product to add it to the customer's order.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => {
                const cartItem = cart.find(
                  (item) =>
                    item.id === product.id
                );

                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() =>
                      addProduct(product)
                    }
                    disabled={loading}
                    className="group relative min-h-[160px] overflow-hidden rounded-3xl border-2 border-lime-500 bg-lime-500 p-5 text-left shadow-sm transition hover:-translate-y-1 hover:bg-lime-400 hover:shadow-lg active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {/* SMALL DECORATION */}
                    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-black/5" />

                    {cartItem && (
                      <div className="absolute right-4 top-4 flex h-9 min-w-9 items-center justify-center rounded-full bg-black px-2 text-sm font-black text-lime-400 shadow">
                        {cartItem.quantity}
                      </div>
                    )}

                    <div className="relative flex h-full flex-col justify-between">
                      <h3 className="max-w-[85%] text-lg font-black leading-tight text-black">
                        {product.name}
                      </h3>

                      <div className="mt-8">
                        <p className="text-3xl font-black tracking-tight text-black">
                          R{product.price}
                        </p>

                        <p className="mt-1 text-xs font-black uppercase tracking-[0.15em] text-black/60">
                          Tap to add
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* CHECKOUT */}
          <aside>
            <div className="sticky top-6 overflow-hidden rounded-3xl border border-zinc-800 bg-black shadow-2xl shadow-black/20">
              {/* CHECKOUT HEADER */}
              <div className="border-b border-zinc-800 bg-zinc-950 p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-lime-400">
                      Checkout
                    </p>

                    <h2 className="mt-1 text-2xl font-black">
                      Customer Basket
                    </h2>

                    <p className="mt-1 text-xs text-zinc-500">
                      Review order before confirming sale
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-400 text-black">
                    <ShoppingCart size={23} />
                  </div>
                </div>
              </div>

              <div className="p-5">
                {/* EMPTY CART */}
                {cart.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-950 px-5 py-12 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 text-lime-400">
                      <ShoppingCart size={27} />
                    </div>

                    <p className="font-black text-white">
                      No products selected
                    </p>

                    <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                      Tap one of the menu items to start the customer's order.
                    </p>
                  </div>
                ) : (
                  <div className="max-h-[340px] space-y-3 overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 transition hover:border-zinc-700"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-black leading-tight text-white">
                              {item.name}
                            </h3>

                            <p className="mt-1 text-sm font-semibold text-zinc-500">
                              R{item.price.toFixed(2)} each
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeItem(item.id)
                            }
                            disabled={loading}
                            className="rounded-xl border border-zinc-800 bg-zinc-900 p-2 text-zinc-500 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                decreaseQuantity(
                                  item.id
                                )
                              }
                              disabled={loading}
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-white transition hover:border-lime-400 hover:text-lime-400"
                            >
                              <Minus size={17} />
                            </button>

                            <div className="flex h-9 min-w-11 items-center justify-center rounded-xl bg-lime-400 px-3 font-black text-black">
                              {item.quantity}
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                increaseQuantity(
                                  item.id
                                )
                              }
                              disabled={loading}
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-white transition hover:border-lime-400 hover:text-lime-400"
                            >
                              <Plus size={17} />
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="text-xs font-bold uppercase tracking-wide text-zinc-600">
                              Subtotal
                            </p>

                            <p className="text-lg font-black text-lime-400">
                              R
                              {(
                                item.price *
                                item.quantity
                              ).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ORDER TOTAL */}
                <div className="mt-5 rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-zinc-500">
                      Total Items
                    </span>

                    <span className="font-black text-white">
                      {totalItems}
                    </span>
                  </div>

                  <div className="my-4 h-px bg-zinc-800" />

                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                        Order Total
                      </p>

                      <p className="mt-1 text-xs font-medium text-zinc-600">
                        Amount customer must pay
                      </p>
                    </div>

                    <span className="text-4xl font-black tracking-tight text-lime-400">
                      R{total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* PAYMENT METHOD */}
                <div className="mt-6">
                  <div className="mb-3">
                    <p className="text-sm font-black text-white">
                      Payment Method
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      Choose how the customer paid
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setPaymentMethod("cash")
                      }
                      disabled={loading}
                      className={`rounded-2xl border px-3 py-3.5 text-sm font-black transition ${
                        paymentMethod === "cash"
                          ? "border-lime-400 bg-lime-400 text-black shadow-lg shadow-lime-400/10"
                          : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-600 hover:text-white"
                      }`}
                    >
                      Cash
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setPaymentMethod("eft")
                      }
                      disabled={loading}
                      className={`rounded-2xl border px-3 py-3.5 text-sm font-black transition ${
                        paymentMethod === "eft"
                          ? "border-lime-400 bg-lime-400 text-black shadow-lg shadow-lime-400/10"
                          : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-600 hover:text-white"
                      }`}
                    >
                      EFT
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setPaymentMethod(
                          "website"
                        )
                      }
                      disabled={loading}
                      className={`rounded-2xl border px-3 py-3.5 text-sm font-black transition ${
                        paymentMethod ===
                        "website"
                          ? "border-lime-400 bg-lime-400 text-black shadow-lg shadow-lime-400/10"
                          : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-600 hover:text-white"
                      }`}
                    >
                      Website
                    </button>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="mt-6 space-y-3">
                  <button
                    type="button"
                    onClick={confirmSale}
                    disabled={
                      loading ||
                      cart.length === 0
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-400 px-5 py-4 text-base font-black text-black transition hover:bg-lime-300 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-600"
                  >
                    {loading
                      ? "Saving Sale..."
                      : `Confirm Sale • R${total.toFixed(
                          2
                        )}`}
                  </button>

                  <button
                    type="button"
                    onClick={clearOrder}
                    disabled={
                      loading ||
                      cart.length === 0
                    }
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-3 text-sm font-bold text-zinc-400 transition hover:border-zinc-700 hover:bg-zinc-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Clear Order
                  </button>
                </div>

                <div className="mt-5 text-center">
                  <p className="text-xs font-semibold tracking-wide text-zinc-700">
                    GenZ Kitchen POS
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}