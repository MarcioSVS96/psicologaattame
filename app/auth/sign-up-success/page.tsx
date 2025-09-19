import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Mail, Heart } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy to-navy-light flex items-center justify-center p-6">
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
            <div className="bg-turquoise/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-turquoise" />
            </div>
            <CardTitle className="text-2xl font-bold text-navy">Cadastro realizado com sucesso!</CardTitle>
            <CardDescription>Verifique seu email para confirmar a conta</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              <p className="text-gray-700">
                Enviamos um email de confirmação para o endereço que você cadastrou. Clique no link do email para ativar
                sua conta.
              </p>
              <p className="text-sm text-gray-600">
                Não recebeu o email? Verifique sua caixa de spam ou entre em contato conosco.
              </p>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full bg-turquoise hover:bg-turquoise/90 text-white">
                <Link href="/auth/login">Ir para o login</Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/">Voltar ao site</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
