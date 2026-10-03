import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

/* =========================================================
   SUPABASE ADMIN CLIENT
========================================================= */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL environment variable"
  );
}

if (!serviceRoleKey) {
  throw new Error(
    "Missing SUPABASE_SERVICE_ROLE_KEY environment variable"
  );
}

const supabaseAdmin = createClient(
  supabaseUrl,
  serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/* =========================================================
   TYPES
========================================================= */

type CreateStockItemBody = {
  name?: string;
  unit?: string;
  lowStockLevel?: number | string;
};

/* =========================================================
   GET
   /api/kitchen/stock

   Loads all active ingredients.
========================================================= */

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("stock_items")
      .select(
        `
          id,
          name,
          unit,
          holding,
          low_stock_level,
          is_active,
          created_at,
          updated_at
        `
      )
      .eq("is_active", true)
      .order("name", {
        ascending: true,
      });

    if (error) {
      console.error(
        "GET stock_items error:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to load stock items.",
          details: error.message,
        },
        {
          status: 500,
        }
      );
    }

    /*
      Convert Supabase snake_case fields
      into cleaner frontend camelCase fields.
    */

    const stock =
      data?.map((item) => ({
        id: item.id,
        name: item.name,
        unit: item.unit,

        holding: Number(
          item.holding ?? 0
        ),

        lowStockLevel: Number(
          item.low_stock_level ?? 0
        ),

        isActive:
          item.is_active,

        createdAt:
          item.created_at,

        updatedAt:
          item.updated_at,
      })) ?? [];

    return NextResponse.json(
      {
        success: true,
        stock,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "GET /api/kitchen/stock error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unexpected server error while loading stock.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   POST
   /api/kitchen/stock

   Creates a NEW ingredient.

   IMPORTANT:
   Every ingredient ALWAYS starts at holding = 0.

   Example request:

   {
     "name": "Cheese Sauce",
     "unit": "portions",
     "lowStockLevel": 5
   }
========================================================= */

export async function POST(
  request: Request
) {
  try {
    /* =====================================================
       READ REQUEST BODY
    ===================================================== */

    let body: CreateStockItemBody;

    try {
      body =
        (await request.json()) as CreateStockItemBody;
    } catch {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid request body.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       CLEAN VALUES
    ===================================================== */

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const unit =
      typeof body.unit === "string"
        ? body.unit.trim()
        : "";

    const lowStockLevel =
      Number(
        body.lowStockLevel ?? 0
      );

    /* =====================================================
       VALIDATE NAME
    ===================================================== */

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Ingredient name is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Ingredient name is too long.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       VALIDATE UNIT
    ===================================================== */

    if (!unit) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Measurement unit is required.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       VALIDATE LOW STOCK LEVEL
    ===================================================== */

    if (
      !Number.isFinite(
        lowStockLevel
      ) ||
      lowStockLevel < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Low stock level must be 0 or greater.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       CHECK IF INGREDIENT ALREADY EXISTS

       We check case-insensitively.

       Example:
       "Burger Buns"
       and
       "burger buns"

       should not both exist.
    ===================================================== */

    const {
      data: existingItems,
      error: existingError,
    } = await supabaseAdmin
      .from("stock_items")
      .select(
        `
          id,
          name,
          is_active
        `
      )
      .ilike(
        "name",
        name
      )
      .limit(1);

    if (existingError) {
      console.error(
        "Ingredient duplicate check error:",
        existingError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to check existing ingredients.",
          details:
            existingError.message,
        },
        {
          status: 500,
        }
      );
    }

    const existing =
      existingItems?.[0];

    if (existing) {
      if (
        existing.is_active
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              `${existing.name} already exists.`,
          },
          {
            status: 409,
          }
        );
      }

      /*
        If an ingredient was previously archived,
        reactivate it instead of creating a duplicate.
      */

      const {
        data: restored,
        error: restoreError,
      } = await supabaseAdmin
        .from("stock_items")
        .update({
          unit,
          low_stock_level:
            lowStockLevel,

          /*
            Reactivated ingredients return
            with holding stock at 0.
          */
          holding: 0,

          is_active: true,
        })
        .eq(
          "id",
          existing.id
        )
        .select(
          `
            id,
            name,
            unit,
            holding,
            low_stock_level,
            is_active,
            created_at,
            updated_at
          `
        )
        .single();

      if (
        restoreError ||
        !restored
      ) {
        console.error(
          "Restore ingredient error:",
          restoreError
        );

        return NextResponse.json(
          {
            success: false,
            error:
              "Unable to restore ingredient.",
            details:
              restoreError?.message,
          },
          {
            status: 500,
          }
        );
      }

      return NextResponse.json(
        {
          success: true,

          message:
            `${restored.name} restored successfully.`,

          stockItem: {
            id: restored.id,

            name:
              restored.name,

            unit:
              restored.unit,

            holding: Number(
              restored.holding ??
                0
            ),

            lowStockLevel:
              Number(
                restored.low_stock_level ??
                  0
              ),

            isActive:
              restored.is_active,

            createdAt:
              restored.created_at,

            updatedAt:
              restored.updated_at,
          },
        },
        {
          status: 200,
        }
      );
    }

    /* =====================================================
       CREATE INGREDIENT

       IMPORTANT:
       holding is ALWAYS 0.

       The frontend is not allowed to choose the
       starting holding quantity.

       Stock must be added using:
       /api/kitchen/stock/[id]/add
    ===================================================== */

    const {
      data: newItem,
      error: insertError,
    } = await supabaseAdmin
      .from("stock_items")
      .insert({
        name,
        unit,

        holding: 0,

        low_stock_level:
          lowStockLevel,

        is_active: true,
      })
      .select(
        `
          id,
          name,
          unit,
          holding,
          low_stock_level,
          is_active,
          created_at,
          updated_at
        `
      )
      .single();

    /* =====================================================
       INSERT ERROR
    ===================================================== */

    if (
      insertError ||
      !newItem
    ) {
      console.error(
        "Create stock item error:",
        insertError
      );

      /*
        PostgreSQL unique violation
      */

      if (
        insertError?.code ===
        "23505"
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              `${name} already exists.`,
          },
          {
            status: 409,
          }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to create ingredient.",
          details:
            insertError?.message,
        },
        {
          status: 500,
        }
      );
    }

    /* =====================================================
       RESPONSE
    ===================================================== */

    return NextResponse.json(
      {
        success: true,

        message:
          `${newItem.name} added to inventory.`,

        stockItem: {
          id: newItem.id,

          name:
            newItem.name,

          unit:
            newItem.unit,

          holding: Number(
            newItem.holding ??
              0
          ),

          lowStockLevel:
            Number(
              newItem.low_stock_level ??
                0
            ),

          isActive:
            newItem.is_active,

          createdAt:
            newItem.created_at,

          updatedAt:
            newItem.updated_at,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST /api/kitchen/stock error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unexpected server error while creating ingredient.",
      },
      {
        status: 500,
      }
    );
  }
}