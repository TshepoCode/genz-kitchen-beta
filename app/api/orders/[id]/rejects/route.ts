import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          error: "Order ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    /* =========================================
       1. FIND WEBSITE ORDER
    ========================================= */

    const {
      data: order,
      error: orderError,
    } = await supabaseAdmin
      .from("website_orders")
      .select(`
        id,
        order_number,
        customer_email,
        influencer_code,
        status,
        payment_status,
        total,
        sale_id,
        created_at
      `)
      .eq("id", id)
      .single();

    if (orderError || !order) {
      console.error(
        "Find website order error:",
        orderError
      );

      return NextResponse.json(
        {
          error: "Website order not found.",
        },
        {
          status: 404,
        }
      );
    }

    /* =========================================
       2. DO NOT REJECT ACCEPTED ORDERS
    ========================================= */

    if (order.status === "accepted") {
      return NextResponse.json(
        {
          error:
            "This order has already been accepted and cannot be rejected.",
        },
        {
          status: 409,
        }
      );
    }

    /*
      Extra protection:

      If this website order is already connected
      to a completed sale, we should never reject it.
    */

    if (order.sale_id) {
      return NextResponse.json(
        {
          error:
            "This order already has a completed sale and cannot be rejected.",
        },
        {
          status: 409,
        }
      );
    }

    /* =========================================
       3. ALREADY REJECTED
    ========================================= */

    if (order.status === "rejected") {
      return NextResponse.json({
        success: true,

        message:
          "This order has already been rejected.",

        order: {
          id: order.id,
          orderNumber:
            order.order_number,
          status:
            order.status,
          paymentStatus:
            order.payment_status,
        },
      });
    }

    /* =========================================
       4. REJECT ORDER
    ========================================= */

    const {
      data: rejectedOrder,
      error: rejectError,
    } = await supabaseAdmin
      .from("website_orders")
      .update({
        status: "rejected",
        payment_status: "failed",
        rejected_at:
          new Date().toISOString(),
      })
      .eq("id", id)
      .eq("status", "pending")
      .select(`
        id,
        order_number,
        customer_email,
        influencer_code,
        total,
        status,
        payment_status,
        rejected_at
      `)
      .single();

    if (
      rejectError ||
      !rejectedOrder
    ) {
      console.error(
        "Reject website order error:",
        rejectError
      );

      return NextResponse.json(
        {
          error:
            rejectError?.message ||
            "Unable to reject order.",
        },
        {
          status: 500,
        }
      );
    }

    /* =========================================
       5. SUCCESS
    ========================================= */

    return NextResponse.json({
      success: true,

      message:
        `${rejectedOrder.order_number} rejected successfully.`,

      order: {
        id:
          rejectedOrder.id,

        orderNumber:
          rejectedOrder.order_number,

        customerEmail:
          rejectedOrder.customer_email,

        influencerCode:
          rejectedOrder.influencer_code,

        total:
          Number(
            rejectedOrder.total
          ),

        status:
          rejectedOrder.status,

        paymentStatus:
          rejectedOrder.payment_status,

        rejectedAt:
          rejectedOrder.rejected_at,
      },
    });
  } catch (error) {
    console.error(
      "Reject website order API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while rejecting the order.",
      },
      {
        status: 500,
      }
    );
  }
}