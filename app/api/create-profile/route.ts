import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing Supabase environment variables");
}

const supabaseAdmin = createClient(supabaseUrl!, serviceRoleKey!);

export async function POST(request: Request) {
  try {
    const { id, fullName, email } = await request.json();

    if (!id || !email) {
      return NextResponse.json(
        { error: "Missing user id or email." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .upsert(
        {
          id,
          full_name: fullName || "",
          email: cleanEmail,
          points: 0,
        },
        { onConflict: "id" }
      )
      .select()
      .single();

    if (error) {
      console.error("Create profile error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, profile: data });
  } catch (error) {
    console.error("Create profile server error:", error);
    return NextResponse.json(
      { error: "Server error while creating profile." },
      { status: 500 }
    );
  }
}