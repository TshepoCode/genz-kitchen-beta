import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getJohannesburgDate() {
  const parts = new Intl.DateTimeFormat(
    "en-ZA",
    {
      timeZone: "Africa/Johannesburg",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  ).formatToParts(new Date());

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

function addOneDay(dateString: string) {
  const [year, month, day] = dateString
    .split("-")
    .map(Number);

  const date = new Date(
    Date.UTC(
      year,
      month - 1,
      day
    )
  );

  date.setUTCDate(
    date.getUTCDate() + 1
  );

  return date
    .toISOString()
    .slice(0, 10);
}

/* ============================================================
   GET TODAY'S EXPENSES
============================================================ */

export async function GET() {
  try {
    const today =
      getJohannesburgDate();

    const tomorrow =
      addOneDay(today);

    const startOfDay =
      `${today}T00:00:00+02:00`;

    const endOfDay =
      `${tomorrow}T00:00:00+02:00`;

    const {
      data,
      error,
    } = await supabaseAdmin
      .from("expenses")
      .select(`
        id,
        category,
        description,
        amount,
        expense_type,
        payment_method,
        branch,
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

    if (error) {
      console.error(
        "Expense fetch error:",
        error
      );

      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

    const expenses =
      data || [];

    const operatingExpenses =
      expenses
        .filter(
          (expense) =>
            expense.expense_type ===
            "operating"
        )
        .reduce(
          (sum, expense) =>
            sum +
            Number(
              expense.amount || 0
            ),
          0
        );

    const investorRepayments =
      expenses
        .filter(
          (expense) =>
            expense.expense_type ===
            "repayment"
        )
        .reduce(
          (sum, expense) =>
            sum +
            Number(
              expense.amount || 0
            ),
          0
        );

    const staffPayments =
      expenses
        .filter(
          (expense) =>
            expense.expense_type ===
            "staff"
        )
        .reduce(
          (sum, expense) =>
            sum +
            Number(
              expense.amount || 0
            ),
          0
        );

    const otherExpenses =
      expenses
        .filter(
          (expense) =>
            expense.expense_type ===
            "other"
        )
        .reduce(
          (sum, expense) =>
            sum +
            Number(
              expense.amount || 0
            ),
          0
        );

    const totalExpenses =
      operatingExpenses +
      investorRepayments +
      staffPayments +
      otherExpenses;

    const cashExpenses =
      expenses
        .filter(
          (expense) =>
            expense.payment_method ===
            "cash"
        )
        .reduce(
          (sum, expense) =>
            sum +
            Number(
              expense.amount || 0
            ),
          0
        );

    const eftExpenses =
      expenses
        .filter(
          (expense) =>
            expense.payment_method ===
            "eft"
        )
        .reduce(
          (sum, expense) =>
            sum +
            Number(
              expense.amount || 0
            ),
          0
        );

    const cardExpenses =
      expenses
        .filter(
          (expense) =>
            expense.payment_method ===
            "card"
        )
        .reduce(
          (sum, expense) =>
            sum +
            Number(
              expense.amount || 0
            ),
          0
        );

    return NextResponse.json({
      success: true,

      date: today,

      summary: {
        operatingExpenses,
        investorRepayments,
        staffPayments,
        otherExpenses,
        totalExpenses,
      },

      paymentBreakdown: {
        cash: cashExpenses,
        eft: eftExpenses,
        card: cardExpenses,
      },

      expenses,
    });
  } catch (error) {
    console.error(
      "Expense GET error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load expenses.",
      },
      {
        status: 500,
      }
    );
  }
}

/* ============================================================
   CREATE EXPENSE
============================================================ */

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const {
      category,
      description,
      amount,
      expenseType,
      paymentMethod,
      branch = "Kagiso",
    } = body;

    if (
      !category ||
      !description ||
      !amount ||
      !expenseType ||
      !paymentMethod
    ) {
      return NextResponse.json(
        {
          error:
            "Please complete all expense fields.",
        },
        {
          status: 400,
        }
      );
    }

    const expenseAmount =
      Number(amount);

    if (
      Number.isNaN(
        expenseAmount
      ) ||
      expenseAmount <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Expense amount must be greater than R0.",
        },
        {
          status: 400,
        }
      );
    }

    const allowedExpenseTypes = [
      "operating",
      "repayment",
      "staff",
      "other",
    ];

    if (
      !allowedExpenseTypes.includes(
        expenseType
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid expense type.",
        },
        {
          status: 400,
        }
      );
    }

    const allowedPaymentMethods = [
      "cash",
      "eft",
      "card",
      "other",
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

    const {
      data,
      error,
    } = await supabaseAdmin
      .from("expenses")
      .insert({
        category,
        description,
        amount: expenseAmount,
        expense_type:
          expenseType,
        payment_method:
          paymentMethod,
        branch,
      })
      .select(`
        id,
        category,
        description,
        amount,
        expense_type,
        payment_method,
        branch,
        created_at
      `)
      .single();

    if (
      error ||
      !data
    ) {
      console.error(
        "Expense insert error:",
        error
      );

      return NextResponse.json(
        {
          error:
            error?.message ||
            "Failed to save expense.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      expense: data,
    });
  } catch (error) {
    console.error(
      "Expense POST error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while saving the expense.",
      },
      {
        status: 500,
      }
    );
  }
}

/* ============================================================
   DELETE EXPENSE
============================================================ */

export async function DELETE(
  request: NextRequest
) {
  try {
    const expenseId =
      request.nextUrl
        .searchParams
        .get("id");

    if (!expenseId) {
      return NextResponse.json(
        {
          error:
            "Expense ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const {
      error,
    } = await supabaseAdmin
      .from("expenses")
      .delete()
      .eq(
        "id",
        expenseId
      );

    if (error) {
      return NextResponse.json(
        {
          error:
            error.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Expense delete error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to delete expense.",
      },
      {
        status: 500,
      }
    );
  }
}