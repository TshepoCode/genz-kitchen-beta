import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

/* =========================================================
   TYPES
========================================================= */

type IncomingSaleItem = {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
};

type IncomingSaleBody = {
  paymentMethod: "cash" | "eft" | "website";
  items: IncomingSaleItem[];
};

/* =========================================================
   POST /api/sale

   MANUAL POS ONLY

   This route:
   1. Receives POS products
   2. Calculates the total
   3. Creates a row in sales
   4. Creates rows in sale_items
   5. Returns the completed sale

   NO customer email
   NO influencer code
   NO delivery / collection
   NO website_orders
========================================================= */

export async function POST(request: Request) {
  try {
    /* =====================================================
       ENVIRONMENT VARIABLES
    ===================================================== */

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error(
        "POS SALE API: Missing Supabase environment variables."
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Missing Supabase environment variables.",
        },
        {
          status: 500,
        }
      );
    }

    /* =====================================================
       CREATE SERVER SUPABASE CLIENT
    ===================================================== */

    const supabaseAdmin = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    /* =====================================================
       READ REQUEST BODY
    ===================================================== */

    let body: IncomingSaleBody;

    try {
      body =
        (await request.json()) as IncomingSaleBody;
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body.",
        },
        {
          status: 400,
        }
      );
    }

    const { paymentMethod, items } = body;

    /* =====================================================
       VALIDATE PAYMENT METHOD
    ===================================================== */

    const allowedPaymentMethods = [
      "cash",
      "eft",
      "website",
    ] as const;

    if (
      !paymentMethod ||
      !allowedPaymentMethods.includes(
        paymentMethod
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid payment method.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       VALIDATE ITEMS
    ===================================================== */

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please select at least one product.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       NORMALISE + VALIDATE ITEMS
    ===================================================== */

    const cleanItems: IncomingSaleItem[] = [];

    for (const item of items) {
      const productId =
        String(item?.product_id ?? "").trim();

      const productName =
        String(item?.product_name ?? "").trim();

      const quantity =
        Number(item?.quantity);

      const price =
        Number(item?.price);

      if (!productId) {
        return NextResponse.json(
          {
            success: false,
            error:
              "One of the products is missing a product ID.",
          },
          {
            status: 400,
          }
        );
      }

      if (!productName) {
        return NextResponse.json(
          {
            success: false,
            error:
              "One of the products is missing a product name.",
          },
          {
            status: 400,
          }
        );
      }

      if (
        !Number.isFinite(quantity) ||
        quantity <= 0 ||
        !Number.isInteger(quantity)
      ) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid quantity for ${productName}.`,
          },
          {
            status: 400,
          }
        );
      }

      if (
        !Number.isFinite(price) ||
        price < 0
      ) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid price for ${productName}.`,
          },
          {
            status: 400,
          }
        );
      }

      cleanItems.push({
        product_id: productId,
        product_name: productName,
        quantity,
        price,
      });
    }

    /* =====================================================
       CALCULATE SALE TOTAL

       The server calculates this.
       We do not trust a total sent from the browser.
    ===================================================== */

    const total = cleanItems.reduce(
      (sum, item) => {
        return (
          sum +
          item.price * item.quantity
        );
      },
      0
    );

    const roundedTotal =
      Math.round(
        (total + Number.EPSILON) * 100
      ) / 100;

    if (
      !Number.isFinite(roundedTotal) ||
      roundedTotal <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Sale total must be greater than R0.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       CREATE SALES ROW
    ===================================================== */

    const {
      data: sale,
      error: saleError,
    } = await supabaseAdmin
      .from("sales")
      .insert({
        total: roundedTotal,
        payment_method: paymentMethod,
      })
      .select(
        `
          id,
          total,
          payment_method,
          created_at
        `
      )
      .single();

    if (saleError) {
      console.error(
        "POS SALE - sales insert error:",
        saleError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            saleError.message ||
            "Unable to create sale.",
        },
        {
          status: 500,
        }
      );
    }

    if (!sale) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Sale was not returned after creation.",
        },
        {
          status: 500,
        }
      );
    }

    /* =====================================================
       CREATE SALE ITEMS
    ===================================================== */

    const saleItems = cleanItems.map(
      (item) => ({
        sale_id: sale.id,

        product_id:
          item.product_id,

        product_name:
          item.product_name,

        quantity:
          item.quantity,

        price:
          item.price,
      })
    );

    const {
      data: insertedItems,
      error: saleItemsError,
    } = await supabaseAdmin
      .from("sale_items")
      .insert(saleItems)
      .select(
        `
          id,
          sale_id,
          product_id,
          product_name,
          quantity,
          price,
          created_at
        `
      );

    /* =====================================================
       ROLLBACK IF SALE ITEMS FAIL
    ===================================================== */

    if (saleItemsError) {
      console.error(
        "POS SALE - sale_items insert error:",
        saleItemsError
      );

      const {
        error: rollbackError,
      } = await supabaseAdmin
        .from("sales")
        .delete()
        .eq("id", sale.id);

      if (rollbackError) {
        console.error(
          "POS SALE - rollback error:",
          rollbackError
        );
      }

      return NextResponse.json(
        {
          success: false,
          error:
            saleItemsError.message ||
            "Unable to save sale items.",
        },
        {
          status: 500,
        }
      );
    }

    /* =====================================================
       SUCCESS
    ===================================================== */

    console.log(
      "POS SALE CREATED:",
      {
        saleId: sale.id,
        total:
          Number(sale.total),
        paymentMethod:
          sale.payment_method,
        itemCount:
          cleanItems.reduce(
            (sum, item) =>
              sum + item.quantity,
            0
          ),
      }
    );

    return NextResponse.json(
      {
        success: true,

        message:
          "Sale recorded successfully.",

        total:
          Number(sale.total),

        sale: {
          id:
            sale.id,

          total:
            Number(sale.total),

          paymentMethod:
            sale.payment_method,

          createdAt:
            sale.created_at,

          items:
            insertedItems ?? [],
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POS SALE API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Unable to record sale.",
      },
      {
        status: 500,
      }
    );
  }
}