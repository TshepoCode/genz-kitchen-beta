import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getJohannesburgDateString(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-ZA", {
    timeZone: "Africa/Johannesburg",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

function addDays(dateString: string, days: number) {
  const [year, month, day] = dateString
    .split("-")
    .map(Number);

  const date = new Date(
    Date.UTC(year, month - 1, day)
  );

  date.setUTCDate(
    date.getUTCDate() + days
  );

  return date
    .toISOString()
    .slice(0, 10);
}

export async function GET() {
  try {
    const today =
      getJohannesburgDateString();

    const tomorrow =
      addDays(today, 1);

    // Johannesburg = UTC+2
    const startOfDay =
      `${today}T00:00:00+02:00`;

    const endOfDay =
      `${tomorrow}T00:00:00+02:00`;

    // =========================================
    // TODAY'S SALES ONLY
    // =========================================

    const {
      data: sales,
      error: salesError,
    } = await supabaseAdmin
      .from("sales")
      .select(`
        id,
        total,
        payment_method,
        created_at
      `)
      .gte(
        "created_at",
        startOfDay
      )
      .lt(
        "created_at",
        endOfDay
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

    if (salesError) {
      console.error(
        "Today's sales error:",
        salesError
      );

      return NextResponse.json(
        {
          error:
            salesError.message,
        },
        {
          status: 500,
        }
      );
    }

    const saleIds =
      sales?.map(
        (sale) => sale.id
      ) || [];

    let saleItems: {
      id: string;
      sale_id: string;
      product_id: string;
      product_name: string;
      quantity: number;
      price: number;
      created_at: string;
    }[] = [];

    // =========================================
    // TODAY'S SALE ITEMS
    // =========================================

    if (saleIds.length > 0) {
      const {
        data: items,
        error: itemsError,
      } = await supabaseAdmin
        .from("sale_items")
        .select(`
          id,
          sale_id,
          product_id,
          product_name,
          quantity,
          price,
          created_at
        `)
        .in(
          "sale_id",
          saleIds
        );

      if (itemsError) {
        console.error(
          "Today's sale items error:",
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

      saleItems =
        items || [];
    }

    // =========================================
    // TOTALS
    // =========================================

    const totalSales =
      (sales || []).reduce(
        (sum, sale) =>
          sum +
          Number(
            sale.total || 0
          ),
        0
      );

    const totalOrders =
      sales?.length || 0;

    const totalItems =
      saleItems.reduce(
        (sum, item) =>
          sum +
          Number(
            item.quantity || 0
          ),
        0
      );

    const averageOrder =
      totalOrders > 0
        ? totalSales /
          totalOrders
        : 0;

    // =========================================
    // PAYMENT BREAKDOWN
    // =========================================

    const cashSales =
      (sales || [])
        .filter(
          (sale) =>
            sale.payment_method ===
            "cash"
        )
        .reduce(
          (sum, sale) =>
            sum +
            Number(
              sale.total || 0
            ),
          0
        );

    const eftSales =
      (sales || [])
        .filter(
          (sale) =>
            sale.payment_method ===
            "eft"
        )
        .reduce(
          (sum, sale) =>
            sum +
            Number(
              sale.total || 0
            ),
          0
        );

    const websiteSales =
      (sales || [])
        .filter(
          (sale) =>
            sale.payment_method ===
            "website"
        )
        .reduce(
          (sum, sale) =>
            sum +
            Number(
              sale.total || 0
            ),
          0
        );

    // =========================================
    // PRODUCT BREAKDOWN
    // =========================================

    const productMap: Record<
      string,
      {
        productId: string;
        productName: string;
        quantity: number;
        sales: number;
      }
    > = {};

    saleItems.forEach(
      (item) => {
        if (
          !productMap[
            item.product_id
          ]
        ) {
          productMap[
            item.product_id
          ] = {
            productId:
              item.product_id,
            productName:
              item.product_name,
            quantity: 0,
            sales: 0,
          };
        }

        productMap[
          item.product_id
        ].quantity += Number(
          item.quantity
        );

        productMap[
          item.product_id
        ].sales +=
          Number(item.price) *
          Number(
            item.quantity
          );
      }
    );

    const productBreakdown =
      Object.values(
        productMap
      ).sort(
        (a, b) =>
          b.quantity -
          a.quantity
      );

    // =========================================
    // RECENT SALES
    // =========================================

    const recentSales =
      (sales || [])
        .slice(0, 10)
        .map((sale) => ({
          id: sale.id,

          total: Number(
            sale.total
          ),

          paymentMethod:
            sale.payment_method,

          createdAt:
            sale.created_at,

          items:
            saleItems.filter(
              (item) =>
                item.sale_id ===
                sale.id
            ),
        }));

    return NextResponse.json({
      success: true,

      date: today,

      summary: {
        sales:
          totalSales,

        orders:
          totalOrders,

        itemsSold:
          totalItems,

        averageOrder,
      },

      payments: {
        cash:
          cashSales,

        eft:
          eftSales,

        website:
          websiteSales,
      },

      productBreakdown,

      recentSales,
    });
  } catch (error) {
    console.error(
      "Kitchen today API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load today's sales.",
      },
      {
        status: 500,
      }
    );
  }
}