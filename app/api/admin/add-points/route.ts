import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      adminEmail,
      customerEmail,
      pointsToAdd,
      action = "add",
    } = body;

    if (!adminEmail || adminEmail !== process.env.ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Unauthorized admin access." },
        { status: 401 }
      );
    }

    if (!customerEmail || !pointsToAdd) {
      return NextResponse.json(
        { error: "Customer email and points are required." },
        { status: 400 }
      );
    }

    if (action !== "add" && action !== "subtract") {
      return NextResponse.json(
        { error: "Action must be add or subtract." },
        { status: 400 }
      );
    }

    const pointsNumber = Number(pointsToAdd);

    if (Number.isNaN(pointsNumber) || pointsNumber <= 0) {
      return NextResponse.json(
        { error: "Points must be greater than 0." },
        { status: 400 }
      );
    }

    const cleanCustomerEmail = String(customerEmail).trim().toLowerCase();

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, email, points")
      .eq("email", cleanCustomerEmail)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Customer not found." },
        { status: 404 }
      );
    }

    const currentPoints = Number(profile.points || 0);

    const newPoints =
      action === "subtract"
        ? currentPoints - pointsNumber
        : currentPoints + pointsNumber;

    if (newPoints < 0) {
      return NextResponse.json(
        {
          error: `Customer only has ${currentPoints} points. You cannot subtract ${pointsNumber} points.`,
        },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ points: newPoints })
      .eq("id", profile.id);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      action,
      customerName: profile.full_name || profile.email,
      customerEmail: profile.email,
      oldPoints: currentPoints,
      addedPoints: action === "add" ? pointsNumber : 0,
      subtractedPoints: action === "subtract" ? pointsNumber : 0,
      pointsChanged: pointsNumber,
      newPoints,
    });
  } catch (error) {
    console.error("Admin points error:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}