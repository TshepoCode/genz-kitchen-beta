// app/api/orders/route.ts

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type IncomingOrderItem = {
  product_id: string;
  product_name: string;
  option_label?: string;
  chips?: string;
  drink?: string;
  quantity: number;
  price: number;
  is_reward?: boolean;
  points_cost?: number;
};

function createOrderNumber() {
  const now = new Date();

  const datePart = now.toISOString().slice(0, 10).replaceAll("-", "");

  const randomPart = crypto.randomUUID().slice(0, 6).toUpperCase();

  return `GK-${datePart}-${randomPart}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      customerEmail,
      influencerCode,
      orderType,
      donation,
      rewardPoints,
      items,
    }: {
      customerEmail: string;
      influencerCode?: string | null;
      orderType: "delivery" | "collection";
      donation: number;
      rewardPoints: number;
      items: IncomingOrderItem[];
    } = body;

    // =====================================================
    // VALIDATION
    // =====================================================

    if (!customerEmail?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Customer email is required.",
        },
        { status: 400 }
      );
    }

    if (orderType !== "delivery" && orderType !== "collection") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid order type.",
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Your cart is empty.",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // NORMALISE ITEMS
    // =====================================================

    const normalisedItems = items.map((item) => ({
      product_id: String(item.product_id),

      product_name: String(item.product_name),

      option_label: item.option_label || null,

      chips: item.chips || null,

      drink: item.drink || null,

      quantity: Math.max(1, Number(item.quantity || 1)),

      price: Math.max(0, Number(item.price || 0)),

      is_reward: Boolean(item.is_reward),

      points_cost: Math.max(0, Number(item.points_cost || 0)),
    }));

    // =====================================================
    // CALCULATE ORDER TOTAL
    // =====================================================

    const itemsTotal = normalisedItems.reduce((total, item) => {
      if (item.is_reward) {
        return total;
      }

      return total + item.price * item.quantity;
    }, 0);

    const safeDonation = Math.max(0, Number(donation || 0));

    const deliveryFee = orderType === "delivery" ? 30 : 0;

    const total = itemsTotal + safeDonation + deliveryFee;

    const safeRewardPoints = Math.max(0, Number(rewardPoints || 0));

    const orderNumber = createOrderNumber();

    // =====================================================
    // CREATE WEBSITE ORDER
    // =====================================================

    const { data: order, error: orderError } = await supabaseAdmin
      .from("website_orders")
      .insert({
        order_number: orderNumber,

        customer_email: customerEmail.trim(),

        influencer_code: influencerCode || null,

        order_type: orderType,

        items_total: itemsTotal,

        donation: safeDonation,

        delivery_fee: deliveryFee,

        total,

        reward_points: safeRewardPoints,

        status: "pending",

        payment_status: "pending",
      })
      .select(
        `
          id,
          order_number,
          customer_email,
          order_type,
          items_total,
          donation,
          delivery_fee,
          total,
          reward_points,
          status,
          payment_status,
          created_at
        `
      )
      .single();

    if (orderError || !order) {
      console.error("CREATE WEBSITE ORDER ERROR:", orderError);

      return NextResponse.json(
        {
          success: false,
          error: orderError?.message || "Unable to create order.",
        },
        { status: 500 }
      );
    }

    // =====================================================
    // CREATE WEBSITE ORDER ITEMS
    // =====================================================

    const orderItems = normalisedItems.map((item) => ({
      order_id: order.id,

      product_id: item.product_id,

      product_name: item.product_name,

      option_label: item.option_label,

      chips: item.chips,

      drink: item.drink,

      quantity: item.quantity,

      price: item.price,

      is_reward: item.is_reward,

      points_cost: item.points_cost,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from("website_order_items")
      .insert(orderItems);

    // =====================================================
    // IF ITEMS FAIL, REMOVE THE ORDER
    // =====================================================

    if (itemsError) {
      console.error("CREATE WEBSITE ORDER ITEMS ERROR:", itemsError);

      await supabaseAdmin
        .from("website_orders")
        .delete()
        .eq("id", order.id);

      return NextResponse.json(
        {
          success: false,
          error: itemsError.message || "Unable to save order items.",
        },
        { status: 500 }
      );
    }

    // =====================================================
    // SUCCESS
    // =====================================================

    console.log("WEBSITE ORDER CREATED:", {
      orderNumber: order.order_number,
      customerEmail: order.customer_email,
      total: order.total,
    });

    return NextResponse.json(
      {
        success: true,

        message: "Order created successfully.",

        order: {
          id: order.id,

          orderNumber: order.order_number,

          customerEmail: order.customer_email,

          orderType: order.order_type,

          itemsTotal: Number(order.items_total),

          donation: Number(order.donation),

          deliveryFee: Number(order.delivery_fee),

          total: Number(order.total),

          rewardPoints: Number(order.reward_points),

          status: order.status,

          paymentStatus: order.payment_status,

          createdAt: order.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("WEBSITE ORDER API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to place order.",
      },
      { status: 500 }
    );
  }
}