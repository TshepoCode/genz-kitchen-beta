// app/api/orders/route.ts

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// ======================================================
// SUPABASE ADMIN CLIENT
// ======================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL environment variable."
  );
}

if (!supabaseServiceRoleKey) {
  throw new Error(
    "Missing SUPABASE_SERVICE_ROLE_KEY environment variable."
  );
}

const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

// ======================================================
// TYPES
// ======================================================

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

type IncomingOrderBody = {
  customerEmail?: string;
  influencerCode?: string | null;
  orderType?: "delivery" | "collection";
  donation?: number;
  rewardPoints?: number;
  items?: IncomingOrderItem[];
};

// ======================================================
// HELPERS
// ======================================================

function createOrderNumber() {
  const now = new Date();

  const datePart = now
    .toISOString()
    .slice(0, 10)
    .replaceAll("-", "");

  const randomPart = crypto
    .randomUUID()
    .slice(0, 6)
    .toUpperCase();

  return `GK-${datePart}-${randomPart}`;
}

function numberValue(value: unknown) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return number;
}

// ======================================================
// GET /api/orders
//
// Used by:
// app/admin/kitchen/sales/page.tsx
//
// Loads all website orders for the kitchen.
// ======================================================

export async function GET() {
  try {
    console.log("GET /api/orders");

    const { data: orders, error } =
      await supabaseAdmin
        .from("website_orders")
        .select(`
          id,
          order_number,
          customer_email,
          influencer_code,
          order_type,
          items_total,
          donation,
          delivery_fee,
          total,
          reward_points,
          status,
          payment_status,
          sale_id,
          created_at,
          accepted_at,
          rejected_at,
          website_order_items (
            id,
            order_id,
            product_id,
            product_name,
            option_label,
            chips,
            drink,
            quantity,
            price,
            is_reward,
            points_cost
          )
        `)
        .order("created_at", {
          ascending: false,
        });

    // ==================================================
    // DATABASE ERROR
    // ==================================================

    if (error) {
      console.error(
        "GET WEBSITE ORDERS DATABASE ERROR:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error: error.message,
          orders: [],
        },
        {
          status: 500,
        }
      );
    }

    // ==================================================
    // FORMAT ORDERS
    //
    // IMPORTANT:
    // Keep snake_case because the Kitchen Sales page
    // expects snake_case properties.
    // ==================================================

    const formattedOrders = (orders ?? []).map(
      (order) => ({
        id: order.id,

        order_number:
          order.order_number,

        customer_email:
          order.customer_email,

        influencer_code:
          order.influencer_code,

        order_type:
          order.order_type,

        items_total:
          numberValue(
            order.items_total
          ),

        donation:
          numberValue(
            order.donation
          ),

        delivery_fee:
          numberValue(
            order.delivery_fee
          ),

        total:
          numberValue(
            order.total
          ),

        reward_points:
          numberValue(
            order.reward_points
          ),

        status:
          order.status,

        payment_status:
          order.payment_status,

        sale_id:
          order.sale_id ?? null,

        created_at:
          order.created_at,

        accepted_at:
          order.accepted_at ?? null,

        rejected_at:
          order.rejected_at ?? null,

        website_order_items:
          (
            order.website_order_items ??
            []
          ).map((item) => ({
            id:
              item.id,

            order_id:
              item.order_id,

            product_id:
              item.product_id,

            product_name:
              item.product_name,

            option_label:
              item.option_label,

            chips:
              item.chips,

            drink:
              item.drink,

            quantity:
              numberValue(
                item.quantity
              ),

            price:
              numberValue(
                item.price
              ),

            is_reward:
              Boolean(
                item.is_reward
              ),

            points_cost:
              numberValue(
                item.points_cost
              ),
          })),
      })
    );

    // ==================================================
    // SUCCESS
    // ==================================================

    return NextResponse.json(
      {
        success: true,
        orders: formattedOrders,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "GET /api/orders UNEXPECTED ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Unable to load website orders.",

        orders: [],
      },
      {
        status: 500,
      }
    );
  }
}

// ======================================================
// POST /api/orders
//
// Used by:
// Customer website checkout
//
// Creates:
// 1. website_orders record
// 2. website_order_items records
// ======================================================

export async function POST(request: Request) {
  try {
    console.log("POST /api/orders");

    // ==================================================
    // READ REQUEST BODY
    // ==================================================

    let body: IncomingOrderBody;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid order request.",
        },
        {
          status: 400,
        }
      );
    }

    const {
      customerEmail,
      influencerCode,
      orderType,
      donation = 0,
      rewardPoints = 0,
      items = [],
    } = body;

    // ==================================================
    // CUSTOMER EMAIL VALIDATION
    // ==================================================

    if (
      !customerEmail ||
      typeof customerEmail !==
        "string" ||
      !customerEmail.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Customer email is required.",
        },
        {
          status: 400,
        }
      );
    }

    // ==================================================
    // ORDER TYPE VALIDATION
    // ==================================================

    if (
      orderType !== "delivery" &&
      orderType !== "collection"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid order type.",
        },
        {
          status: 400,
        }
      );
    }

    // ==================================================
    // CART VALIDATION
    // ==================================================

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Your cart is empty.",
        },
        {
          status: 400,
        }
      );
    }

    // ==================================================
    // NORMALISE ORDER ITEMS
    // ==================================================

    const normalisedItems =
      items.map((item) => {
        const quantity =
          Math.max(
            1,
            Math.floor(
              numberValue(
                item.quantity
              )
            )
          );

        const price =
          Math.max(
            0,
            numberValue(
              item.price
            )
          );

        const pointsCost =
          Math.max(
            0,
            Math.floor(
              numberValue(
                item.points_cost
              )
            )
          );

        return {
          product_id:
            String(
              item.product_id ?? ""
            ).trim(),

          product_name:
            String(
              item.product_name ?? ""
            ).trim(),

          option_label:
            item.option_label?.trim() ||
            null,

          chips:
            item.chips?.trim() ||
            null,

          drink:
            item.drink?.trim() ||
            null,

          quantity,

          price,

          is_reward:
            Boolean(
              item.is_reward
            ),

          points_cost:
            pointsCost,
        };
      });

    // ==================================================
    // PRODUCT VALIDATION
    // ==================================================

    const invalidItem =
      normalisedItems.find(
        (item) =>
          !item.product_id ||
          !item.product_name
      );

    if (invalidItem) {
      return NextResponse.json(
        {
          success: false,
          error:
            "One or more order items are invalid.",
        },
        {
          status: 400,
        }
      );
    }

    // ==================================================
    // CALCULATE ITEMS TOTAL
    // ==================================================

    const itemsTotal =
      normalisedItems.reduce(
        (total, item) => {
          // Reward items cost R0
          // in the cash total.

          if (item.is_reward) {
            return total;
          }

          return (
            total +
            item.price *
              item.quantity
          );
        },
        0
      );

    // ==================================================
    // DONATION
    // ==================================================

    const safeDonation =
      Math.max(
        0,
        numberValue(donation)
      );

    // ==================================================
    // DELIVERY FEE
    // ==================================================

    const deliveryFee =
      orderType === "delivery"
        ? 30
        : 0;

    // ==================================================
    // REWARD POINTS
    // ==================================================

    const safeRewardPoints =
      Math.max(
        0,
        Math.floor(
          numberValue(
            rewardPoints
          )
        )
      );

    // ==================================================
    // FINAL TOTAL
    // ==================================================

    const total =
      itemsTotal +
      safeDonation +
      deliveryFee;

    // ==================================================
    // ORDER NUMBER
    // ==================================================

    const orderNumber =
      createOrderNumber();

    // ==================================================
    // CLEAN INFLUENCER CODE
    // ==================================================

    const safeInfluencerCode =
      typeof influencerCode ===
        "string" &&
      influencerCode.trim()
        ? influencerCode.trim()
        : null;

    // ==================================================
    // INSERT WEBSITE ORDER
    // ==================================================

    const {
      data: order,
      error: orderError,
    } = await supabaseAdmin
      .from("website_orders")
      .insert({
        order_number:
          orderNumber,

        customer_email:
          customerEmail.trim(),

        influencer_code:
          safeInfluencerCode,

        order_type:
          orderType,

        items_total:
          itemsTotal,

        donation:
          safeDonation,

        delivery_fee:
          deliveryFee,

        total,

        reward_points:
          safeRewardPoints,

        status:
          "pending",

        payment_status:
          "pending",
      })
      .select(`
        id,
        order_number,
        customer_email,
        influencer_code,
        order_type,
        items_total,
        donation,
        delivery_fee,
        total,
        reward_points,
        status,
        payment_status,
        created_at
      `)
      .single();

    // ==================================================
    // ORDER INSERT FAILED
    // ==================================================

    if (
      orderError ||
      !order
    ) {
      console.error(
        "CREATE WEBSITE ORDER ERROR:",
        orderError
      );

      return NextResponse.json(
        {
          success: false,

          error:
            orderError?.message ||
            "Unable to create order.",
        },
        {
          status: 500,
        }
      );
    }

    // ==================================================
    // PREPARE ORDER ITEMS
    // ==================================================

    const orderItems =
      normalisedItems.map(
        (item) => ({
          order_id:
            order.id,

          product_id:
            item.product_id,

          product_name:
            item.product_name,

          option_label:
            item.option_label,

          chips:
            item.chips,

          drink:
            item.drink,

          quantity:
            item.quantity,

          price:
            item.price,

          is_reward:
            item.is_reward,

          points_cost:
            item.points_cost,
        })
      );

    // ==================================================
    // INSERT ORDER ITEMS
    // ==================================================

    const {
      error: itemsError,
    } = await supabaseAdmin
      .from(
        "website_order_items"
      )
      .insert(orderItems);

    // ==================================================
    // ORDER ITEMS FAILED
    // ==================================================

    if (itemsError) {
      console.error(
        "CREATE WEBSITE ORDER ITEMS ERROR:",
        itemsError
      );

      // Remove the parent order so
      // incomplete orders are not left
      // in the kitchen system.

      const {
        error: rollbackError,
      } = await supabaseAdmin
        .from("website_orders")
        .delete()
        .eq(
          "id",
          order.id
        );

      if (rollbackError) {
        console.error(
          "ORDER ROLLBACK ERROR:",
          rollbackError
        );
      }

      return NextResponse.json(
        {
          success: false,

          error:
            itemsError.message ||
            "Unable to save order items.",
        },
        {
          status: 500,
        }
      );
    }

    // ==================================================
    // SUCCESS
    //
    // Customer menu currently expects:
    //
    // result.order.orderNumber
    // result.order.total
    //
    // So POST response remains camelCase.
    // ==================================================

    console.log(
      "WEBSITE ORDER CREATED:",
      {
        id:
          order.id,

        orderNumber:
          order.order_number,

        customerEmail:
          order.customer_email,

        influencerCode:
          order.influencer_code,

        total:
          order.total,
      }
    );

    return NextResponse.json(
      {
        success: true,

        message:
          "Order created successfully.",

        order: {
          id:
            order.id,

          orderNumber:
            order.order_number,

          customerEmail:
            order.customer_email,

          influencerCode:
            order.influencer_code,

          orderType:
            order.order_type,

          itemsTotal:
            numberValue(
              order.items_total
            ),

          donation:
            numberValue(
              order.donation
            ),

          deliveryFee:
            numberValue(
              order.delivery_fee
            ),

          total:
            numberValue(
              order.total
            ),

          rewardPoints:
            numberValue(
              order.reward_points
            ),

          status:
            order.status,

          paymentStatus:
            order.payment_status,

          createdAt:
            order.created_at,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST /api/orders UNEXPECTED ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Unable to place order.",
      },
      {
        status: 500,
      }
    );
  }
}