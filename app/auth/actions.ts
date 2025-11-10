"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()

  // Redireciona para a URL base do site (produção ou desenvolvimento)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "/"
  return redirect(siteUrl)
}
