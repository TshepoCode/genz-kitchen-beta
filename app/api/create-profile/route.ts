import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { id, fullName, email } = await request.json();

    if (!id || !email) {
      return NextResponse.json(
        { error: "User ID and email are required." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin.from("profiles").upsert(
      {
        id,
        full_name: fullName || "",
        email: email.toLowerCase(),
        points: 0,
      },
      { onConflict: "id" }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong creating profile." },
      { status: 500 }
    );
  }
}