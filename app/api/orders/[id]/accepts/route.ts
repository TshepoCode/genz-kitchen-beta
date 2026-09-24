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

/* =========================================================
   POST
   Accept website order + create official sale
========================================================= */

export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    /* =====================================================
       1. VALIDATE ORDER ID
    ===================================================== */

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

    /* =====================================================
       2. OPTIONAL PAYMENT METHOD FROM ADMIN
    ===================================================== */

    let paymentMethod = "website";

    try {
      const body = await request.json();

      if (body?.paymentMethod) {
        paymentMethod =
          String(
            body.paymentMethod
          ).toLowerCase();
      }
    } catch {
      /*
        No body is also valid.

        Website will be used as the
        default payment method.
      */
    }

    const allowedPaymentMethods = [
      "cash",
      "eft",
      "website",
    ];

    if (
      !allowedPaymentMethods.includes(
        paymentMethod
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid payment method.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       3. GET WEBSITE ORDER
    ===================================================== */

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
        rejected_at
      `)
      .eq("id", id)
      .single();

    if (
      orderError ||
      !order
    ) {
      console.error(
        "Find website order error:",
        orderError
      );

      return NextResponse.json(
        {
          error:
            "Website order not found.",
        },
        {
          status: 404,
        }
      );
    }

    /* =====================================================
       4. BLOCK REJECTED ORDERS
    ===================================================== */

    if (
      order.status ===
      "rejected"
    ) {
      return NextResponse.json(
        {
          error:
            "This order has already been rejected and cannot be accepted.",
        },
        {
          status: 409,
        }
      );
    }

    /* =====================================================
       5. PREVENT DUPLICATE SALES

       If sale_id already exists, this order has already
       been converted into a sale.

       This protects against double-clicks/retries.
    ===================================================== */

    if (order.sale_id) {
      return NextResponse.json({
        success: true,

        alreadyAccepted: true,

        message:
          "This order has already been accepted.",

        order: {
          id:
            order.id,

          orderNumber:
            order.order_number,

          status:
            order.status,

          paymentStatus:
            order.payment_status,

          saleId:
            order.sale_id,

          total:
            Number(
              order.total
            ),
        },
      });
    }

    /* =====================================================
       6. ONLY PENDING ORDERS CAN CONTINUE
    ===================================================== */

    if (
      order.status !==
      "pending"
    ) {
      return NextResponse.json(
        {
          error:
            "Only pending orders can be accepted.",
        },
        {
          status: 409,
        }
      );
    }

    /* =====================================================
       7. GET WEBSITE ORDER ITEMS
    ===================================================== */

    const {
      data: items,
      error: itemsError,
    } = await supabaseAdmin
      .from(
        "website_order_items"
      )
      .select(`
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
      `)
      .eq(
        "order_id",
        order.id
      );

    if (itemsError) {
      console.error(
        "Website order items error:",
        itemsError
      );

      return NextResponse.json(
        {
          error:
            itemsError.message,
        },
        {
          status: 500,
        }
      );
    }

    const typedItems =
      (items ||
        []) as WebsiteOrderItem[];

    if (
      typedItems.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "This order does not contain any items.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       8. ONLY PAID PRODUCTS BECOME SALE ITEMS

       Reward items cost R0 and should not increase revenue.
    ===================================================== */

    const paidItems =
      typedItems.filter(
        (item) =>
          !item.is_reward
      );

    /* =====================================================
       9. CALCULATE PRODUCT TOTAL

       We calculate this again instead of blindly trusting
       the browser.
    ===================================================== */

    const productTotal =
      paidItems.reduce(
        (sum, item) =>
          sum +
          Number(
            item.price
          ) *
            Number(
              item.quantity
            ),
        0
      );

    /*
      The website order total can also contain:

      donation
      delivery fee

      For financial reporting we will use the final
      website order total for the sales transaction.
    */

    const saleTotal =
      Number(
        order.total || 0
      );

    if (
      !Number.isFinite(
        saleTotal
      ) ||
      saleTotal < 0
    ) {
      return NextResponse.json(
        {
          error:
            "The order total is invalid.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       10. CREATE SALE
    ===================================================== */

    const {
      data: sale,
      error: saleError,
    } = await supabaseAdmin
      .from("sales")
      .insert({
        total:
          saleTotal,

        payment_method:
          paymentMethod,
      })
      .select(`
        id,
        total,
        payment_method,
        created_at
      `)
      .single();

    if (
      saleError ||
      !sale
    ) {
      console.error(
        "Create sale error:",
        saleError
      );

      return NextResponse.json(
        {
          error:
            saleError?.message ||
            "Unable to create sale.",
        },
        {
          status: 500,
        }
      );
    }

    /* =====================================================
       11. CREATE SALE ITEMS
    ===================================================== */

    if (
      paidItems.length > 0
    ) {
      const saleItems =
        paidItems.map(
          (item) => {
            /*
              Add customisation information to the
              product name so History still tells us
              exactly what was ordered.
            */

            const extras = [
              item.option_label,
              item.chips,
              item.drink,
            ].filter(Boolean);

            const productName =
              extras.length > 0
                ? `${item.product_name} (${extras.join(
                    " • "
                  )})`
                : item.product_name;

            return {
              sale_id:
                sale.id,

              product_id:
                item.product_id,

              product_name:
                productName,

              quantity:
                Number(
                  item.quantity
                ),

              price:
                Number(
                  item.price
                ),
            };
          }
        );

      const {
        error:
          saleItemsError,
      } = await supabaseAdmin
        .from("sale_items")
        .insert(
          saleItems
        );

      if (
        saleItemsError
      ) {
        console.error(
          "Create sale items error:",
          saleItemsError
        );

        /*
          Roll back the sale so we do not leave a
          transaction without its products.
        */

        await supabaseAdmin
          .from("sales")
          .delete()
          .eq(
            "id",
            sale.id
          );

        return NextResponse.json(
          {
            error:
              saleItemsError.message ||
              "Unable to create sale items.",
          },
          {
            status: 500,
          }
        );
      }
    }

    /* =====================================================
       12. MARK WEBSITE ORDER AS ACCEPTED
    ===================================================== */

    const acceptedAt =
      new Date().toISOString();

    const {
      data:
        acceptedOrder,
      error:
        acceptError,
    } = await supabaseAdmin
      .from(
        "website_orders"
      )
      .update({
        status:
          "accepted",

        payment_status:
          "paid",

        sale_id:
          sale.id,

        accepted_at:
          acceptedAt,
      })
      .eq(
        "id",
        order.id
      )
      .eq(
        "status",
        "pending"
      )
      .is(
        "sale_id",
        null
      )
      .select(`
        id,
        order_number,
        customer_email,
        influencer_code,
        order_type,
        total,
        status,
        payment_status,
        sale_id,
        accepted_at
      `)
      .single();

    /* =====================================================
       13. IF ORDER UPDATE FAILS, DELETE CREATED SALE

       This prevents an orphan sale from appearing in
       analytics if the order could not be accepted.
    ===================================================== */

    if (
      acceptError ||
      !acceptedOrder
    ) {
      console.error(
        "Accept order error:",
        acceptError
      );

      await supabaseAdmin
        .from("sales")
        .delete()
        .eq(
          "id",
          sale.id
        );

      return NextResponse.json(
        {
          error:
            acceptError?.message ||
            "Unable to accept order.",
        },
        {
          status: 500,
        }
      );
    }

    /* =====================================================
       14. SUCCESS
    ===================================================== */

    return NextResponse.json({
      success: true,

      message:
        `${acceptedOrder.order_number} accepted successfully.`,

      order: {
        id:
          acceptedOrder.id,

        orderNumber:
          acceptedOrder.order_number,

        customerEmail:
          acceptedOrder.customer_email,

        influencerCode:
          acceptedOrder.influencer_code,

        orderType:
          acceptedOrder.order_type,

        total:
          Number(
            acceptedOrder.total
          ),

        status:
          acceptedOrder.status,

        paymentStatus:
          acceptedOrder.payment_status,

        acceptedAt:
          acceptedOrder.accepted_at,
      },

      sale: {
        id:
          sale.id,

        total:
          Number(
            sale.total
          ),

        productTotal,

        paymentMethod:
          sale.payment_method,

        createdAt:
          sale.created_at,
      },
    });
  } catch (error) {
    console.error(
      "Accept website order API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while accepting the order.",
      },
      {
        status: 500,
      }
    );
  }
}