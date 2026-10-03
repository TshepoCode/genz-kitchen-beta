import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL is missing."
  );
}

if (!serviceRoleKey) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY is missing."
  );
}

const supabaseAdmin =
  createClient(
    supabaseUrl,
    serviceRoleKey
  );

/* =========================================================
   TYPES
========================================================= */

type IncomingOrderItem = {
  product_id?: string;
  productId?: string;

  product_name?: string;
  productName?: string;

  itemName?: string;
  name?: string;

  option_label?: string | null;
  optionLabel?: string | null;

  chips?: string | null;
  drink?: string | null;

  quantity?: number;

  price?: number;

  is_reward?: boolean;
  isReward?: boolean;

  points_cost?: number;
  pointsCost?: number;
};

/* =========================================================
   ORDER NUMBER
========================================================= */

function generateOrderNumber() {
  const now = new Date();

  const year =
    now.getFullYear();

  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    now.getDate()
  ).padStart(2, "0");

  const random =
    crypto.randomUUID()
      .replace(/-/g, "")
      .slice(0, 6)
      .toUpperCase();

  return `GK-${year}${month}${day}-${random}`;
}

/* =========================================================
   GET WEBSITE ORDERS

   Used by:
   /admin/kitchen/sale
========================================================= */

export async function GET() {
  try {
    console.log(
      "GET /api/orders"
    );

    const {
      data: orders,
      error,
    } = await supabaseAdmin
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
          points_cost,
          created_at
        )
      `)
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

    if (error) {
      console.error(
        "GET website orders Supabase error:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error:
            error.message,
          details:
            error.details,
          hint:
            error.hint,
          code:
            error.code,
        },
        {
          status: 500,
        }
      );
    }

    console.log(
      `Loaded ${
        orders?.length || 0
      } website orders`
    );

    return NextResponse.json(
      {
        success: true,
        orders:
          orders || [],
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "GET /api/orders unexpected error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof
          Error
            ? error.message
            : "Unable to load website orders.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   POST WEBSITE ORDER

   Used by:
   Customer menu checkout
========================================================= */

export async function POST(
  request: Request
) {
  let createdOrderId:
    | string
    | null = null;

  try {
    console.log(
      "POST /api/orders"
    );

    const body =
      await request.json();

    /* =====================================================
       CUSTOMER
    ===================================================== */

    const customerEmail =
      String(
        body.customerEmail ||
          body.customer_email ||
          ""
      ).trim();

    if (!customerEmail) {
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

    /* =====================================================
       ORDER TYPE
    ===================================================== */

    const orderType =
      String(
        body.orderType ||
          body.order_type ||
          ""
      )
        .trim()
        .toLowerCase();

    if (
      orderType !==
        "delivery" &&
      orderType !==
        "collection"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Order type must be delivery or collection.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       ITEMS
    ===================================================== */

    const incomingItems:
      IncomingOrderItem[] =
      Array.isArray(
        body.items
      )
        ? body.items
        : [];

    if (
      incomingItems.length ===
      0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The order does not contain any items.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       NORMALISE ITEMS
    ===================================================== */

    const normalisedItems =
      incomingItems.map(
        (item, index) => {
          const productId =
            String(
              item.product_id ||
                item.productId ||
                `website-item-${index + 1}`
            );

          const productName =
            String(
              item.product_name ||
                item.productName ||
                item.itemName ||
                item.name ||
                "Menu Item"
            );

          const quantity =
            Number(
              item.quantity ||
                1
            );

          const price =
            Number(
              item.price ||
                0
            );

          const isReward =
            Boolean(
              item.is_reward ??
                item.isReward ??
                false
            );

          const pointsCost =
            Number(
              item.points_cost ??
                item.pointsCost ??
                0
            );

          return {
            product_id:
              productId,

            product_name:
              productName,

            option_label:
              item.option_label ??
              item.optionLabel ??
              null,

            chips:
              item.chips ||
              null,

            drink:
              item.drink ||
              null,

            quantity,

            price,

            is_reward:
              isReward,

            points_cost:
              pointsCost,
          };
        }
      );

    /* =====================================================
       VALIDATE ITEMS
    ===================================================== */

    for (
      const item of
      normalisedItems
    ) {
      if (
        !Number.isFinite(
          item.quantity
        ) ||
        item.quantity <= 0
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "An order item has an invalid quantity.",
          },
          {
            status: 400,
          }
        );
      }

      if (
        !Number.isFinite(
          item.price
        ) ||
        item.price < 0
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "An order item has an invalid price.",
          },
          {
            status: 400,
          }
        );
      }
    }

    /* =====================================================
       TOTALS
    ===================================================== */

    const itemsTotal =
      normalisedItems.reduce(
        (
          sum,
          item
        ) => {
          if (
            item.is_reward
          ) {
            return sum;
          }

          return (
            sum +
            item.price *
              item.quantity
          );
        },
        0
      );

    const donation =
      Math.max(
        0,
        Number(
          body.donation ??
            body.donationAmount ??
            0
        ) || 0
      );

    const deliveryFee =
      orderType ===
      "delivery"
        ? 30
        : 0;

    const total =
      itemsTotal +
      donation +
      deliveryFee;

    const rewardPoints =
      normalisedItems.reduce(
        (
          sum,
          item
        ) =>
          sum +
          (item.is_reward
            ? item.points_cost *
              item.quantity
            : 0),
        0
      );

    /* =====================================================
       INFLUENCER CODE
    ===================================================== */

    const rawInfluencerCode =
      body.influencerCode ??
      body.influencer_code ??
      null;

    const influencerCode =
      rawInfluencerCode
        ? String(
            rawInfluencerCode
          ).trim()
        : null;

    /* =====================================================
       CREATE ORDER
    ===================================================== */

    const orderNumber =
      generateOrderNumber();

    const {
      data: order,
      error: orderError,
    } = await supabaseAdmin
      .from(
        "website_orders"
      )
      .insert({
        order_number:
          orderNumber,

        customer_email:
          customerEmail,

        influencer_code:
          influencerCode,

        order_type:
          orderType,

        items_total:
          itemsTotal,

        donation,

        delivery_fee:
          deliveryFee,

        total,

        reward_points:
          rewardPoints,

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

    if (
      orderError ||
      !order
    ) {
      console.error(
        "Create website order error:",
        orderError
      );

      return NextResponse.json(
        {
          success: false,

          error:
            orderError?.message ||
            "Unable to create website order.",

          details:
            orderError?.details,

          hint:
            orderError?.hint,

          code:
            orderError?.code,
        },
        {
          status: 500,
        }
      );
    }

    createdOrderId =
      order.id;

    /* =====================================================
       CREATE ORDER ITEMS
    ===================================================== */

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

    const {
      error:
        orderItemsError,
    } = await supabaseAdmin
      .from(
        "website_order_items"
      )
      .insert(
        orderItems
      );

    if (
      orderItemsError
    ) {
      console.error(
        "Create website order items error:",
        orderItemsError
      );

      /*
        Remove the order because
        its items failed to save.
      */

      await supabaseAdmin
        .from(
          "website_orders"
        )
        .delete()
        .eq(
          "id",
          order.id
        );

      createdOrderId =
        null;

      return NextResponse.json(
        {
          success: false,

          error:
            orderItemsError.message ||
            "Unable to save website order items.",

          details:
            orderItemsError.details,

          hint:
            orderItemsError.hint,

          code:
            orderItemsError.code,
        },
        {
          status: 500,
        }
      );
    }

    /* =====================================================
       SUCCESS
    ===================================================== */

    return NextResponse.json(
      {
        success: true,

        message:
          "Order created successfully.",

        orderId:
          order.id,

        orderNumber:
          order.order_number,

        total:
          Number(
            order.total
          ),

        status:
          order.status,

        paymentStatus:
          order.payment_status,

        order: {
          ...order,

          website_order_items:
            orderItems,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST /api/orders unexpected error:",
      error
    );

    /*
      Safety cleanup if something
      failed after creating the order.
    */

    if (
      createdOrderId
    ) {
      await supabaseAdmin
        .from(
          "website_orders"
        )
        .delete()
        .eq(
          "id",
          createdOrderId
        );
    }

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof
          Error
            ? error.message
            : "Something went wrong while creating the order.",
      },
      {
        status: 500,
      }
    );
  }
}