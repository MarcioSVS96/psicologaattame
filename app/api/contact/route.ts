import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = await createClient()

  try {
    const { name, email, phone, subject, message } = await request.json()

    // Validação básica dos dados recebidos
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ message: "Todos os campos obrigatórios devem ser preenchidos." }, { status: 400 })
    }

    // Insere a mensagem na tabela 'contact_messages'
    const { data, error } = await supabase
      .from("contact_messages")
      .insert({
        name,
        email,
        phone,
        subject,
        message,
        status: "unread", // Define o status inicial como 'não lida'
      })
      .select()

    if (error) throw error

    return NextResponse.json({ message: "Mensagem enviada com sucesso!", data }, { status: 201 })
  } catch (error: any) {
    console.error("Erro ao salvar mensagem de contato:", error)
    return NextResponse.json({ message: error.message || "Ocorreu um erro no servidor." }, { status: 500 })
  }
}