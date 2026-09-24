"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Globe2,
  Hash,
  Loader2,
  Mail,
  PackageCheck,
  RefreshCw,
  Store,
  Trophy,
  Truck,
  XCircle,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type OrderStatus =
  | "pending"
  | "accepted"
  | "rejected";

type PaymentStatus =
  | "pending"
  | "paid"
  | "failed";

type PaymentMethod =
  | "cash"
  | "eft"
  | "website";

type WebsiteOrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  option_label: string | null;
  chips: string | null;
  drink: string | null;
  quantity: number;
  price: number;
  is_reward: boolean;
  points_cost: number;
};

type WebsiteOrder = {
  id: string;
  order_number: string;
  customer_email: string;
  influencer_code: string | null;
  order_type: "delivery" | "collection";
  items_total: number;
  donation: number;
  delivery_fee: number;
  total: number;
  reward_points: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  sale_id: string | null;
  created_at: string;
  accepted_at: string | null;
  rejected_at: string | null;
  website_order_items: WebsiteOrderItem[];
};

type OrderFilter =
  | "pending"
  | "accepted"
  | "rejected";

/* =========================================================
   HELPERS
========================================================= */

function money(
  value: number | string | null | undefined
) {
  const amount = Number(value || 0);

  return `R${amount.toFixed(2)}`;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Unknown time";
  }

  return new Intl.DateTimeFormat("en-ZA", {
    timeZone: "Africa/Johannesburg",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/* =========================================================
   PAGE
========================================================= */

export default function WebsiteOrdersPage() {
  const [
    websiteOrders,
    setWebsiteOrders,
  ] = useState<WebsiteOrder[]>([]);

  const [
    orderFilter,
    setOrderFilter,
  ] = useState<OrderFilter>("pending");

  const [
    ordersLoading,
    setOrdersLoading,
  ] = useState(true);

  const [
    ordersError,
    setOrdersError,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
    processingOrderId,
    setProcessingOrderId,
  ] = useState<string | null>(null);

  const [
    websitePaymentMethods,
    setWebsitePaymentMethods,
  ] = useState<Record<string, PaymentMethod>>({});

  /* =======================================================
     COUNTS
  ======================================================= */

  const pendingCount = useMemo(
    () =>
      websiteOrders.filter(
        (order) => order.status === "pending"
      ).length,
    [websiteOrders]
  );

  const acceptedCount = useMemo(
    () =>
      websiteOrders.filter(
        (order) => order.status === "accepted"
      ).length,
    [websiteOrders]
  );

  const rejectedCount = useMemo(
    () =>
      websiteOrders.filter(
        (order) => order.status === "rejected"
      ).length,
    [websiteOrders]
  );

  const filteredOrders = useMemo(
    () =>
      websiteOrders.filter(
        (order) =>
          order.status === orderFilter
      ),
    [websiteOrders, orderFilter]
  );

  /* =======================================================
     LOAD WEBSITE ORDERS

     This page talks ONLY to /api/orders
  ======================================================= */

  const loadWebsiteOrders =
    useCallback(
      async (showLoader = true) => {
        if (showLoader) {
          setOrdersLoading(true);
        }

        setOrdersError("");

        try {
          const response = await fetch(
            "/api/orders",
            {
              method: "GET",
              cache: "no-store",
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
            const text =
              await response.text();

            console.error(
              "Orders API returned non JSON:",
              text
            );

            throw new Error(
              `Orders API returned ${response.status}.`
            );
          }

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data?.error ||
                data?.message ||
                "Unable to load website orders."
            );
          }

          const loadedOrders =
            (data.orders ||
              []) as WebsiteOrder[];

          setWebsiteOrders(
            loadedOrders
          );

          setWebsitePaymentMethods(
            (current) => {
              const next = {
                ...current,
              };

              loadedOrders.forEach(
                (order) => {
                  if (!next[order.id]) {
                    next[order.id] =
                      "eft";
                  }
                }
              );

              return next;
            }
          );
        } catch (err) {
          console.error(
            "Load website orders:",
            err
          );

          setOrdersError(
            err instanceof Error
              ? err.message
              : "Unable to load website orders."
          );
        } finally {
          if (showLoader) {
            setOrdersLoading(false);
          }
        }
      },
      []
    );

  /* =======================================================
     AUTO REFRESH
  ======================================================= */

  useEffect(() => {
    loadWebsiteOrders();

    const interval =
      window.setInterval(
        () => {
          loadWebsiteOrders(false);
        },
        20000
      );

    return () => {
      window.clearInterval(interval);
    };
  }, [loadWebsiteOrders]);

  /* =======================================================
     ACCEPT WEBSITE ORDER
  ======================================================= */

  async function acceptWebsiteOrder(
    order: WebsiteOrder
  ) {
    if (processingOrderId) {
      return;
    }

    const selectedPaymentMethod =
      websitePaymentMethods[
        order.id
      ] || "eft";

    const confirmed =
      window.confirm(
        `Confirm payment for ${order.order_number}?\n\nTotal: ${money(
          order.total
        )}\nPayment Method: ${selectedPaymentMethod.toUpperCase()}\n\nThis will create an official GenZ Kitchen sale.`
      );

    if (!confirmed) {
      return;
    }

    setProcessingOrderId(
      order.id
    );

    setOrdersError("");
    setSuccessMessage("");

    try {
      const response =
        await fetch(
          `/api/orders/${order.id}/accept`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              paymentMethod:
                selectedPaymentMethod,
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
        const text =
          await response.text();

        console.error(
          "Accept API returned non JSON:",
          text
        );

        throw new Error(
          `Accept order API returned ${response.status}.`
        );
      }

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            "Unable to accept order."
        );
      }

      setSuccessMessage(
        `${order.order_number} payment confirmed and sale recorded.`
      );

      await loadWebsiteOrders(
        false
      );

      setOrderFilter(
        "accepted"
      );
    } catch (err) {
      console.error(
        "Accept website order:",
        err
      );

      setOrdersError(
        err instanceof Error
          ? err.message
          : "Unable to accept order."
      );
    } finally {
      setProcessingOrderId(
        null
      );
    }
  }

  /* =======================================================
     REJECT WEBSITE ORDER
  ======================================================= */

  async function rejectWebsiteOrder(
    order: WebsiteOrder
  ) {
    if (processingOrderId) {
      return;
    }

    const confirmed =
      window.confirm(
        `Reject ${order.order_number}?\n\nThis order will not be recorded as a sale.`
      );

    if (!confirmed) {
      return;
    }

    setProcessingOrderId(
      order.id
    );

    setOrdersError("");
    setSuccessMessage("");

    try {
      const response =
        await fetch(
          `/api/orders/${order.id}/rejects`,
          {
            method: "POST",
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
        const text =
          await response.text();

        console.error(
          "Reject API returned non JSON:",
          text
        );

        throw new Error(
          `Reject order API returned ${response.status}.`
        );
      }

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            "Unable to reject order."
        );
      }

      setSuccessMessage(
        `${order.order_number} rejected.`
      );

      await loadWebsiteOrders(
        false
      );

      setOrderFilter(
        "rejected"
      );
    } catch (err) {
      console.error(
        "Reject website order:",
        err
      );

      setOrdersError(
        err instanceof Error
          ? err.message
          : "Unable to reject order."
      );
    } finally {
      setProcessingOrderId(
        null
      );
    }
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-100">
      <div className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8">

        {/* HEADER */}

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

            <div className="flex items-center gap-2 text-lime-600">
              <Globe2
                size={18}
              />

              <p className="text-xs font-black uppercase tracking-[0.2em]">
                Website Orders
              </p>
            </div>

            <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Order Control Centre
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              View customer orders,
              competition codes,
              payment details and
              confirm completed sales.
            </p>
          </div>

          <div className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:w-auto sm:px-4">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black text-lime-400">
              <Globe2
                size={20}
              />

              {pendingCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-black text-white">
                  {pendingCount}
                </span>
              )}
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Website Orders
              </p>

              <p className="text-sm font-black text-slate-900">
                {pendingCount} pending
              </p>
            </div>
          </div>
        </div>

        {/* SUCCESS */}

        {successMessage && (
          <div className="mb-5 flex gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-800">
            <CheckCircle2
              size={21}
              className="shrink-0"
            />

            <p className="text-sm font-bold">
              {successMessage}
            </p>
          </div>
        )}

        {/* MAIN CARD */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:rounded-[32px]">

          {/* BLACK HEADER */}

          <div className="bg-black p-4 text-white sm:p-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2 text-lime-400">
                  <Globe2
                    size={18}
                  />

                  <p className="text-xs font-black uppercase tracking-[0.2em]">
                    Live Website Orders
                  </p>
                </div>

                <h2 className="mt-2 text-xl font-black sm:text-3xl">
                  Customer Orders
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">
                  Website orders refresh
                  automatically every
                  20 seconds.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  loadWebsiteOrders()
                }
                disabled={
                  ordersLoading
                }
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm font-black transition hover:border-lime-400 hover:text-lime-400 disabled:opacity-50 sm:w-auto"
              >
                <RefreshCw
                  size={17}
                  className={
                    ordersLoading
                      ? "animate-spin"
                      : ""
                  }
                />

                Refresh Orders
              </button>
            </div>
          </div>

          {/* FILTERS */}

          <div className="border-b border-slate-200 p-3 sm:p-6">
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() =>
                  setOrderFilter(
                    "pending"
                  )
                }
                className={`rounded-xl px-1 py-3 text-[11px] font-black transition sm:rounded-2xl sm:px-3 sm:text-sm ${
                  orderFilter ===
                  "pending"
                    ? "bg-lime-400 text-black"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                Pending{" "}
                {pendingCount}
              </button>

              <button
                type="button"
                onClick={() =>
                  setOrderFilter(
                    "accepted"
                  )
                }
                className={`rounded-xl px-1 py-3 text-[11px] font-black transition sm:rounded-2xl sm:px-3 sm:text-sm ${
                  orderFilter ===
                  "accepted"
                    ? "bg-black text-lime-400"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                Accepted{" "}
                {acceptedCount}
              </button>

              <button
                type="button"
                onClick={() =>
                  setOrderFilter(
                    "rejected"
                  )
                }
                className={`rounded-xl px-1 py-3 text-[11px] font-black transition sm:rounded-2xl sm:px-3 sm:text-sm ${
                  orderFilter ===
                  "rejected"
                    ? "bg-red-600 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                Rejected{" "}
                {rejectedCount}
              </button>
            </div>
          </div>

          {/* ERROR */}

          {ordersError && (
            <div className="m-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700 sm:m-5">
              {ordersError}
            </div>
          )}

          {/* LOADING */}

          {ordersLoading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="text-center">
                <Loader2
                  size={34}
                  className="mx-auto animate-spin text-lime-500"
                />

                <p className="mt-3 text-sm font-bold text-slate-500">
                  Loading website
                  orders...
                </p>
              </div>
            </div>
          ) : filteredOrders.length ===
            0 ? (
            <div className="p-5 sm:p-10">
              <div className="mx-auto max-w-md rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                <PackageCheck
                  size={35}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-4 font-black text-slate-800">
                  No {orderFilter} orders
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Website orders will
                  appear here.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 p-3 sm:p-6 xl:grid-cols-2">
              {filteredOrders.map(
                (order) => {
                  const isProcessing =
                    processingOrderId ===
                    order.id;

                  const orderItems =
                    order.website_order_items ||
                    [];

                  return (
                    <article
                      key={order.id}
                      className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:rounded-3xl"
                    >
                      {/* ORDER HEADER */}

                      <div className="border-b border-slate-100 bg-slate-50 p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                              Order Number
                            </p>

                            <div className="mt-1 flex flex-wrap items-center gap-2">
                              <p className="break-all text-base font-black text-slate-950 sm:text-lg">
                                {order.order_number ||
                                  "No order number"}
                              </p>

                              <span
                                className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${
                                  order.status ===
                                  "pending"
                                    ? "bg-amber-100 text-amber-700"
                                    : order.status ===
                                        "accepted"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700"
                                }`}
                              >
                                {order.status}
                              </span>
                            </div>

                            <p className="mt-2 text-xs font-semibold text-slate-400">
                              {formatDate(
                                order.created_at
                              )}
                            </p>
                          </div>

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-black text-lime-400">
                            <Hash
                              size={19}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="p-4 sm:p-5">
                        {/* CUSTOMER */}

                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                              <Mail
                                size={17}
                              />
                            </div>

                            <div className="min-w-0">
                              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                                Customer Email
                              </p>

                              <p className="mt-1 break-all text-sm font-black text-slate-950">
                                {order.customer_email ||
                                  "Email unavailable"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* INFLUENCER */}

                        <div className="mt-3 rounded-2xl border-2 border-lime-300 bg-lime-50 p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lime-400 text-black">
                              <Trophy
                                size={19}
                              />
                            </div>

                            <div className="min-w-0">
                              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-lime-700">
                                Influencer /
                                Competition Code
                              </p>

                              <p className="mt-1 break-all text-lg font-black text-black">
                                {order.influencer_code ||
                                  "No influencer code selected"}
                              </p>

                              {order.influencer_code &&
                                order.status ===
                                  "pending" && (
                                  <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
                                    Count this order
                                    only after payment
                                    has been confirmed.
                                  </p>
                                )}
                            </div>
                          </div>
                        </div>

                        {/* ORDER TYPE */}

                        <div className="mt-3 rounded-2xl bg-slate-50 p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-lime-400">
                              {order.order_type ===
                              "delivery" ? (
                                <Truck
                                  size={18}
                                />
                              ) : (
                                <Store
                                  size={18}
                                />
                              )}
                            </div>

                            <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                                Order Type
                              </p>

                              <p className="mt-1 text-sm font-black capitalize text-slate-950">
                                {
                                  order.order_type
                                }
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* ITEMS */}

                        <div className="mt-5">
                          <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                            Order Items
                          </p>

                          {orderItems.length ===
                          0 ? (
                            <div className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">
                              No order items
                              returned.
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {orderItems.map(
                                (item) => (
                                  <div
                                    key={
                                      item.id
                                    }
                                    className={`rounded-2xl border p-3 ${
                                      item.is_reward
                                        ? "border-purple-200 bg-purple-50"
                                        : "border-slate-100 bg-white"
                                    }`}
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="min-w-0 flex-1">
                                        <p className="break-words text-sm font-black text-slate-900">
                                          {
                                            item.quantity
                                          }{" "}
                                          ×{" "}
                                          {
                                            item.product_name
                                          }
                                        </p>

                                        {item.option_label && (
                                          <p className="mt-1 text-xs text-slate-500">
                                            {
                                              item.option_label
                                            }
                                          </p>
                                        )}

                                        {item.chips && (
                                          <p className="mt-1 text-xs text-slate-500">
                                            Chips:{" "}
                                            {
                                              item.chips
                                            }
                                          </p>
                                        )}

                                        {item.drink && (
                                          <p className="mt-1 text-xs text-slate-500">
                                            Drink:{" "}
                                            {
                                              item.drink
                                            }
                                          </p>
                                        )}

                                        {item.is_reward && (
                                          <p className="mt-1 text-xs font-bold text-purple-600">
                                            Reward •{" "}
                                            {
                                              item.points_cost
                                            }{" "}
                                            points
                                          </p>
                                        )}
                                      </div>

                                      <p className="shrink-0 text-sm font-black text-slate-900">
                                        {item.is_reward
                                          ? "FREE"
                                          : money(
                                              Number(
                                                item.price
                                              ) *
                                                Number(
                                                  item.quantity
                                                )
                                            )}
                                      </p>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </div>

                        {/* TOTALS */}

                        <div className="mt-5 rounded-3xl bg-black p-4 text-white sm:p-5">
                          <div className="flex justify-between gap-3 text-sm">
                            <span className="text-zinc-400">
                              Items
                            </span>

                            <span className="font-bold">
                              {money(
                                order.items_total
                              )}
                            </span>
                          </div>

                          {Number(
                            order.donation
                          ) > 0 && (
                            <div className="mt-2 flex justify-between gap-3 text-sm">
                              <span className="text-zinc-400">
                                Donation
                              </span>

                              <span className="font-bold">
                                {money(
                                  order.donation
                                )}
                              </span>
                            </div>
                          )}

                          {Number(
                            order.delivery_fee
                          ) > 0 && (
                            <div className="mt-2 flex justify-between gap-3 text-sm">
                              <span className="text-zinc-400">
                                Delivery
                              </span>

                              <span className="font-bold">
                                {money(
                                  order.delivery_fee
                                )}
                              </span>
                            </div>
                          )}

                          <div className="my-4 h-px bg-zinc-800" />

                          <div className="flex items-end justify-between gap-3">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                Total To Pay
                              </p>

                              <p
                                className={`mt-1 text-xs font-bold capitalize ${
                                  order.payment_status ===
                                  "paid"
                                    ? "text-green-400"
                                    : order.payment_status ===
                                        "failed"
                                      ? "text-red-400"
                                      : "text-amber-400"
                                }`}
                              >
                                Payment:{" "}
                                {
                                  order.payment_status
                                }
                              </p>
                            </div>

                            <p className="shrink-0 text-2xl font-black text-lime-400 sm:text-3xl">
                              {money(
                                order.total
                              )}
                            </p>
                          </div>
                        </div>

                        {/* PENDING ACTIONS */}

                        {order.status ===
                          "pending" && (
                          <div className="mt-5">
                            <div className="mb-4">
                              <div className="mb-2 flex items-center gap-2">
                                <CreditCard
                                  size={16}
                                />

                                <p className="text-sm font-black">
                                  Payment
                                  Received Via
                                </p>
                              </div>

                              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                                {(
                                  [
                                    "cash",
                                    "eft",
                                    "website",
                                  ] as PaymentMethod[]
                                ).map(
                                  (
                                    method
                                  ) => (
                                    <button
                                      key={
                                        method
                                      }
                                      type="button"
                                      disabled={
                                        isProcessing
                                      }
                                      onClick={() =>
                                        setWebsitePaymentMethods(
                                          (
                                            current
                                          ) => ({
                                            ...current,
                                            [order.id]:
                                              method,
                                          })
                                        )
                                      }
                                      className={`rounded-xl border px-1 py-3 text-[10px] font-black uppercase transition sm:px-2 sm:text-xs ${
                                        (websitePaymentMethods[
                                          order.id
                                        ] ||
                                          "eft") ===
                                        method
                                          ? "border-lime-400 bg-lime-400 text-black"
                                          : "border-slate-200 bg-slate-50 text-slate-500"
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

                            <div className="grid gap-2 sm:grid-cols-2">
                              <button
                                type="button"
                                disabled={
                                  isProcessing
                                }
                                onClick={() =>
                                  rejectWebsiteOrder(
                                    order
                                  )
                                }
                                className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-black text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {isProcessing ? (
                                  <Loader2
                                    size={17}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <XCircle
                                    size={17}
                                  />
                                )}

                                Reject Order
                              </button>

                              <button
                                type="button"
                                disabled={
                                  isProcessing
                                }
                                onClick={() =>
                                  acceptWebsiteOrder(
                                    order
                                  )
                                }
                                className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-lime-400 px-4 py-3 text-sm font-black text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {isProcessing ? (
                                  <Loader2
                                    size={17}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <CheckCircle2
                                    size={17}
                                  />
                                )}

                                Payment Received
                              </button>
                            </div>
                          </div>
                        )}

                        {/* ACCEPTED */}

                        {order.status ===
                          "accepted" && (
                          <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-4">
                            <div className="flex gap-3">
                              <CheckCircle2
                                size={20}
                                className="shrink-0 text-green-600"
                              />

                              <div>
                                <p className="font-black text-green-800">
                                  Payment confirmed
                                </p>

                                <p className="mt-1 text-xs font-semibold text-green-700">
                                  This order has
                                  been recorded as
                                  an official sale.
                                </p>

                                {order.sale_id && (
                                  <p className="mt-2 break-all text-[10px] text-green-600">
                                    Sale ID:{" "}
                                    {
                                      order.sale_id
                                    }
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* REJECTED */}

                        {order.status ===
                          "rejected" && (
                          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4">
                            <div className="flex gap-3">
                              <XCircle
                                size={20}
                                className="shrink-0 text-red-600"
                              />

                              <div>
                                <p className="font-black text-red-800">
                                  Order rejected
                                </p>

                                <p className="mt-1 text-xs font-semibold text-red-700">
                                  This order was
                                  not recorded as
                                  a sale.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </article>
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