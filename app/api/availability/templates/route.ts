import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { data, error } = await supabase
      .from("availability_templates")
      .select("*")
      .eq("admin_id", user.id) // Usar admin_id em vez de created_by
      .order("day_of_week", { ascending: true })
      .order("start_time", { ascending: true })

    if (error) {
      console.error("Error fetching availability templates:", error)
      return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { day_of_week, start_time, end_time, is_available } = body

    const { data, error } = await supabase
      .from("availability_templates")
      .insert({
        admin_id: user.id, // Usar admin_id
        day_of_week,
        start_time,
        end_time,
        is_available,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating availability template:", error)
      return NextResponse.json({ error: "Failed to create template" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
