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

const TIME_ZONE = "Africa/Johannesburg";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const SHORT_MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function getSAKey(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find(
    (part) => part.type === "year"
  )?.value;

  const month = parts.find(
    (part) => part.type === "month"
  )?.value;

  const day = parts.find(
    (part) => part.type === "day"
  )?.value;

  return `${year}-${month}-${day}`;
}

function dateFromSAKey(key: string) {
  return new Date(`${key}T12:00:00+02:00`);
}

function addDays(
  key: string,
  days: number
) {
  const date = dateFromSAKey(key);

  date.setUTCDate(
    date.getUTCDate() + days
  );

  return getSAKey(date);
}

function getDayName(key: string) {
  return new Intl.DateTimeFormat(
    "en-ZA",
    {
      timeZone: TIME_ZONE,
      weekday: "long",
    }
  ).format(dateFromSAKey(key));
}

function getShortDay(key: string) {
  return new Intl.DateTimeFormat(
    "en-ZA",
    {
      timeZone: TIME_ZONE,
      weekday: "short",
    }
  ).format(dateFromSAKey(key));
}

export async function GET() {
  try {
    // ============================================
    // CURRENT JOHANNESBURG DATE
    // ============================================

    const now = new Date();

    const today = getSAKey(now);

    const currentYear =
      Number(today.slice(0, 4));

    const currentMonth =
      Number(today.slice(5, 7));

    const currentMonthName =
      MONTH_NAMES[currentMonth - 1];

    // ============================================
    // CURRENT WEEK
    // Sunday -> Saturday
    // ============================================

    const todayDate =
      dateFromSAKey(today);

    const weekday =
      todayDate.getUTCDay();

    const weekStart =
      addDays(today, -weekday);

    const weekEnd =
      addDays(weekStart, 6);

    // ============================================
    // OFFICIAL SALES START
    //
    // 21 September 2026
    // Johannesburg UTC+2
    // ============================================

    const officialStartUTC =
      "2026-09-20T22:00:00.000Z";

    // ============================================
    // READ SALES
    // ============================================

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
        officialStartUTC
      )
      .order(
        "created_at",
        {
          ascending: true,
        }
      );

    if (salesError) {
      console.error(
        "Analytics sales error:",
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

    const typedSales =
      (sales || []) as Sale[];

    // ============================================
    // WEEK DATA
    // ============================================

    const week = Array.from(
      {
        length: 7,
      },
      (_, index) => {
        const date =
          addDays(
            weekStart,
            index
          );

        return {
          date,

          day:
            getDayName(date),

          shortDay:
            getShortDay(date),

          sales: 0,

          orders: 0,

          isToday:
            date === today,
        };
      }
    );

    // ============================================
    // CURRENT MONTH DATA
    // ============================================

    const daysInMonth =
      new Date(
        currentYear,
        currentMonth,
        0
      ).getDate();

    const month =
      Array.from(
        {
          length: daysInMonth,
        },
        (_, index) => {
          const dayNumber =
            index + 1;

          const date =
            `${currentYear}-${String(
              currentMonth
            ).padStart(
              2,
              "0"
            )}-${String(
              dayNumber
            ).padStart(
              2,
              "0"
            )}`;

          return {
            date,
            day: dayNumber,
            sales: 0,
            orders: 0,
            isToday:
              date === today,
          };
        }
      );

    // ============================================
    // YEAR DATA
    // ============================================

    const year =
      MONTH_NAMES.map(
        (
          monthName,
          index
        ) => ({
          month:
            monthName,

          shortMonth:
            SHORT_MONTH_NAMES[
              index
            ],

          monthNumber:
            index + 1,

          sales: 0,

          orders: 0,
        })
      );

    // ============================================
    // APPLY SALES TO WEEK / MONTH / YEAR
    // ============================================

    typedSales.forEach(
      (sale) => {
        const saleDate =
          getSAKey(
            new Date(
              sale.created_at
            )
          );

        const saleYear =
          Number(
            saleDate.slice(
              0,
              4
            )
          );

        const saleMonth =
          Number(
            saleDate.slice(
              5,
              7
            )
          );

        const total =
          Number(
            sale.total || 0
          );

        // WEEK
        const weekDay =
          week.find(
            (day) =>
              day.date ===
              saleDate
          );

        if (weekDay) {
          weekDay.sales +=
            total;

          weekDay.orders +=
            1;
        }

        // MONTH
        if (
          saleYear ===
            currentYear &&
          saleMonth ===
            currentMonth
        ) {
          const monthDay =
            month.find(
              (day) =>
                day.date ===
                saleDate
            );

          if (monthDay) {
            monthDay.sales +=
              total;

            monthDay.orders +=
              1;
          }
        }

        // YEAR
        if (
          saleYear ===
          currentYear
        ) {
          const yearMonth =
            year[
              saleMonth - 1
            ];

          if (yearMonth) {
            yearMonth.sales +=
              total;

            yearMonth.orders +=
              1;
          }
        }
      }
    );

    // ============================================
    // WEEK SUMMARY
    // ============================================

    const weeklySales =
      week.reduce(
        (sum, day) =>
          sum +
          day.sales,
        0
      );

    const weeklyOrders =
      week.reduce(
        (sum, day) =>
          sum +
          day.orders,
        0
      );

    // ============================================
    // MONTH SUMMARY
    // ============================================

    const monthlySales =
      month.reduce(
        (sum, day) =>
          sum +
          day.sales,
        0
      );

    const monthlyOrders =
      month.reduce(
        (sum, day) =>
          sum +
          day.orders,
        0
      );

    // ============================================
    // YEAR SUMMARY
    // ============================================

    const yearToDate =
      year.reduce(
        (sum, item) =>
          sum +
          item.sales,
        0
      );

    const yearOrders =
      year.reduce(
        (sum, item) =>
          sum +
          item.orders,
        0
      );

    // ============================================
    // AVERAGE ORDER
    // ============================================

    const averageOrder =
      yearOrders > 0
        ? yearToDate /
          yearOrders
        : 0;

    // ============================================
    // BEST WEEK DAY
    // ============================================

    const activeWeekDays =
      week.filter(
        (day) =>
          day.sales > 0
      );

    let bestDay:
      string | null =
      null;

    let highestSales = 0;

    if (
      activeWeekDays.length >
      0
    ) {
      const highest =
        activeWeekDays.reduce(
          (
            best,
            current
          ) =>
            current.sales >
            best.sales
              ? current
              : best
        );

      bestDay =
        highest.day;

      highestSales =
        highest.sales;
    }

    // ============================================
    // BEST MONTH
    // ============================================

    const activeMonths =
      year.filter(
        (item) =>
          item.sales > 0
      );

    let bestMonth:
      string | null =
      null;

    let bestMonthSales = 0;

    if (
      activeMonths.length > 0
    ) {
      const highestMonth =
        activeMonths.reduce(
          (
            best,
            current
          ) =>
            current.sales >
            best.sales
              ? current
              : best
        );

      bestMonth =
        highestMonth.month;

      bestMonthSales =
        highestMonth.sales;
    }

    // ============================================
    // RESPONSE
    // ============================================

    return NextResponse.json({
      success: true,

      currentYear,

      currentMonth,

      currentMonthName,

      today,

      weekStart,

      weekEnd,

      summary: {
        weeklySales,
        weeklyOrders,

        monthlySales,
        monthlyOrders,

        averageOrder,

        yearToDate,
        yearOrders,

        highestSales,
        bestDay,

        bestMonth,
        bestMonthSales,
      },

      week,

      month,

      year,
    });
  } catch (error) {
    console.error(
      "Sales analytics error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load sales analytics.",
      },
      {
        status: 500,
      }
    );
  }
}