import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type Sale = {
  id: string;
  total: number;
  payment_method: string;
  created_at: string;
};

type SaleItem = {
  id: string;
  sale_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  created_at: string;
};

function getSAKey(
  dateString: string
) {
  const parts =
    new Intl.DateTimeFormat(
      "en-ZA",
      {
        timeZone:
          "Africa/Johannesburg",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    ).formatToParts(
      new Date(dateString)
    );

  const year =
    parts.find(
      (part) =>
        part.type === "year"
    )?.value;

  const month =
    parts.find(
      (part) =>
        part.type === "month"
    )?.value;

  const day =
    parts.find(
      (part) =>
        part.type === "day"
    )?.value;

  return `${year}-${month}-${day}`;
}

export async function GET() {
  try {
    // ========================================
    // GET ALL SALES
    // ========================================

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
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

    if (salesError) {
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

    const typedSales =
      (sales || []) as Sale[];

    const saleIds =
      typedSales.map(
        (sale) => sale.id
      );

    let saleItems:
      SaleItem[] = [];

    // ========================================
    // GET SALE ITEMS
    // ========================================

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
        (items ||
          []) as SaleItem[];
    }

    // ========================================
    // GROUP SALES BY SA DATE
    // ========================================

    const dayMap: Record<
      string,
      {
        date: string;
        totalSales: number;
        orders: number;
        itemsSold: number;

        payments: {
          cash: number;
          eft: number;
          website: number;
        };

        sales: {
          id: string;
          total: number;
          paymentMethod: string;
          createdAt: string;
          items: SaleItem[];
        }[];
      }
    > = {};

    typedSales.forEach(
      (sale) => {
        const date =
          getSAKey(
            sale.created_at
          );

        if (!dayMap[date]) {
          dayMap[date] = {
            date,

            totalSales: 0,
            orders: 0,
            itemsSold: 0,

            payments: {
              cash: 0,
              eft: 0,
              website: 0,
            },

            sales: [],
          };
        }

        const items =
          saleItems.filter(
            (item) =>
              item.sale_id ===
              sale.id
          );

        const itemsSold =
          items.reduce(
            (sum, item) =>
              sum +
              Number(
                item.quantity
              ),
            0
          );

        dayMap[
          date
        ].totalSales +=
          Number(
            sale.total || 0
          );

        dayMap[
          date
        ].orders += 1;

        dayMap[
          date
        ].itemsSold +=
          itemsSold;

        if (
          sale.payment_method ===
          "cash"
        ) {
          dayMap[
            date
          ].payments.cash +=
            Number(
              sale.total
            );
        }

        if (
          sale.payment_method ===
          "eft"
        ) {
          dayMap[
            date
          ].payments.eft +=
            Number(
              sale.total
            );
        }

        if (
          sale.payment_method ===
          "website"
        ) {
          dayMap[
            date
          ].payments.website +=
            Number(
              sale.total
            );
        }

        dayMap[
          date
        ].sales.push({
          id:
            sale.id,

          total:
            Number(
              sale.total
            ),

          paymentMethod:
            sale.payment_method,

          createdAt:
            sale.created_at,

          items,
        });
      }
    );

    // Newest first
    const history =
      Object.values(
        dayMap
      ).sort(
        (a, b) =>
          b.date.localeCompare(
            a.date
          )
      );

    // ========================================
    // OVERALL TOTALS
    // ========================================

    const totalRevenue =
      history.reduce(
        (sum, day) =>
          sum +
          day.totalSales,
        0
      );

    const totalOrders =
      history.reduce(
        (sum, day) =>
          sum + day.orders,
        0
      );

    const totalItems =
      history.reduce(
        (sum, day) =>
          sum +
          day.itemsSold,
        0
      );

    return NextResponse.json({
      success: true,

      summary: {
        totalRevenue,
        totalOrders,
        totalItems,
        tradingDays:
          history.length,
      },

      history,
    });
  } catch (error) {
    console.error(
      "Sales history error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load sales history.",
      },
      {
        status: 500,
      }
    );
  }
}