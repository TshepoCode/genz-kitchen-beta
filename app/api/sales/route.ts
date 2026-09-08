import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type SaleItem = {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      items,
      paymentMethod,
    }: {
      items: SaleItem[];
      paymentMethod: string;
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "No sale items provided." },
        { status: 400 }
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { error: "Payment method is required." },
        { status: 400 }
      );
    }

    const allowedPaymentMethods = [
      "cash",
      "eft",
      "website",
    ];

    if (!allowedPaymentMethods.includes(paymentMethod)) {
      return NextResponse.json(
        { error: "Invalid payment method." },
        { status: 400 }
      );
    }

    // ============================================
    // VALIDATE ITEMS
    // ============================================

    for (const item of items) {
      if (
        !item.product_id ||
        !item.product_name ||
        !item.quantity ||
        !item.price
      ) {
        return NextResponse.json(
          { error: "Invalid sale item." },
          { status: 400 }
        );
      }

      if (Number(item.quantity) <= 0) {
        return NextResponse.json(
          { error: "Quantity must be greater than 0." },
          { status: 400 }
        );
      }

      if (Number(item.price) < 0) {
        return NextResponse.json(
          { error: "Price cannot be negative." },
          { status: 400 }
        );
      }
    }

    // ============================================
    // CALCULATE ORDER TOTAL
    // ============================================

    const total = items.reduce(
      (sum, item) =>
        sum +
        Number(item.price) *
          Number(item.quantity),
      0
    );

    // ============================================
    // CREATE SALE
    // ============================================

    const {
      data: sale,
      error: saleError,
    } = await supabaseAdmin
      .from("sales")
      .insert({
        total,
        payment_method: paymentMethod,
      })
      .select("id, total, payment_method, created_at")
      .single();

    if (saleError || !sale) {
      console.error("Sale insert error:", saleError);

      return NextResponse.json(
        {
          error:
            saleError?.message ||
            "Failed to create sale.",
        },
        { status: 500 }
      );
    }

    // ============================================
    // CREATE SALE ITEMS
    // ============================================

    const saleItems = items.map((item) => ({
      sale_id: sale.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: Number(item.quantity),
      price: Number(item.price),
    }));

    const { error: saleItemsError } =
      await supabaseAdmin
        .from("sale_items")
        .insert(saleItems);

    if (saleItemsError) {
      console.error(
        "Sale items insert error:",
        saleItemsError
      );

      // Remove the parent sale if item creation fails
      await supabaseAdmin
        .from("sales")
        .delete()
        .eq("id", sale.id);

      return NextResponse.json(
        {
          error:
            saleItemsError.message ||
            "Failed to save sale items.",
        },
        { status: 500 }
      );
    }

    // ============================================
    // SUCCESS RESPONSE
    // ============================================

    return NextResponse.json({
      success: true,
      saleId: sale.id,
      total: Number(sale.total),
      paymentMethod: sale.payment_method,
      createdAt: sale.created_at,
      items,
    });
  } catch (error) {
    console.error("Sales API error:", error);

    return NextResponse.json(
      {
        error: "Something went wrong while saving the sale.",
      },
      { status: 500 }
    );
  }
}