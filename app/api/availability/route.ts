import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("availability")
      .select("*")
      .eq("admin_id", user.id) // Usar admin_id em vez de created_by
      .order("date", { ascending: true })
      .order("start_time", { ascending: true })

    if (error) {
      console.error("Error fetching availability:", error)
      return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { date, start_time, end_time, is_available } = body

    const { data, error } = await supabase
      .from("availability")
      .insert({
        admin_id: user.id, // Usar admin_id
        date,
        start_time,
        end_time,
        is_available,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating availability:", error)
      return NextResponse.json({ error: "Failed to create availability" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
