"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Heart, Loader2 } from "lucide-react"

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [consentGiven, setConsentGiven] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem")
      setIsLoading(false)
      return
    }

    // Validação de complexidade da senha
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(formData.password)) {
      setError("A senha deve ter no mínimo 8 caracteres, incluindo letra maiúscula, minúscula, número e caractere especial (@$!%*?&).")
      setIsLoading(false)
      return
    }

    if (!consentGiven) {
      setError("Você deve aceitar o termo de consentimento para continuar.")
      setIsLoading(false)
      return
    }

    try {
      const profileData = {
        full_name: formData.fullName,
        phone: formData.phone,
        consent_given: consentGiven,
        role: "patient",
      }

      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: profileData,
        },
      })
      if (error) throw error
      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Ocorreu um erro durante o cadastro")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-warm-gray flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-white hover:text-turquoise transition-colors"
          >
            <Heart className="h-8 w-8" />
            <span className="text-2xl font-serif font-bold">Beatriz Attame</span>
          </Link>
        </div>

        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-navy">Criar nova conta</CardTitle>
            <CardDescription>Preencha os dados para se cadastrar como paciente</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-6">
              {/* --- DADOS BÁSICOS --- */}
              <h3 className="text-lg font-semibold text-navy border-b pb-2">Informações da Conta</h3>

              <div className="space-y-2">
                <Label htmlFor="fullName">Nome completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Seu nome completo"
                  required
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(11) 91111-1111"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                />
              </div>

              {/* --- CONSENTIMENTO --- */}
              <h3 className="text-lg font-semibold text-navy border-b pb-2 pt-4">Autorização e Consentimento</h3>
              <div className="flex items-start space-x-3 rounded-md border p-4">
                <Checkbox id="consent" checked={consentGiven} onCheckedChange={(checked) => setConsentGiven(Boolean(checked))} />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="consent">Termo de Consentimento Informado</Label>
                  <p className="text-sm text-muted-foreground">
                    Declaro que li e aceito os termos de serviço e a política de privacidade, consentindo com o tratamento dos meus dados para fins terapêuticos.
                  </p>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-turquoise hover:bg-turquoise/90 text-white font-semibold"
                disabled={isLoading}
              >
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Criando conta...</> : "Criar conta"}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-4">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{" "}
                <Link href="/auth/login" className="text-turquoise hover:underline font-medium">
                  Faça login aqui
                </Link>
              </p>
              <Link href="/" className="text-sm text-gray-500 hover:text-navy transition-colors">
                ← Voltar ao site
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
