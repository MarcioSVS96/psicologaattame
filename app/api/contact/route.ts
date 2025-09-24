import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ message: "Todos os campos obrigatórios devem ser preenchidos" }, { status: 400 })
    }

    // Insert contact message
    const { data, error } = await supabase
      .from("contact_messages")
      .insert({
        name,
        email,
        phone: phone || null,
        subject,
        message,
        status: "unread",
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating contact message:", error)
      return NextResponse.json({ message: "Erro ao enviar mensagem" }, { status: 500 })
    }

    return NextResponse.json({ message: "Mensagem enviada com sucesso", data }, { status: 201 })
  } catch (error) {
    console.error("Error in contact API:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
