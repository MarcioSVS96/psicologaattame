import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProfileForm } from "@/components/profile-form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) {
    // Este caso não deve acontecer se um perfil for criado no cadastro.
    return <div>Perfil não encontrado.</div>
  }

  return (
    <div className="min-h-screen bg-warm-gray p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm" className="mb-4 -ml-4 text-navy hover:bg-navy/10">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para o Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-navy">Atualizar Perfil</h1>
          <p className="text-gray-600 mt-1">Mantenha suas informações pessoais atualizadas.</p>
        </div>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 sm:p-8">
            <ProfileForm profile={profile} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
