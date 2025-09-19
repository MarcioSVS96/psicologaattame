import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertCircle, Heart } from "lucide-react"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

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
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-navy">Ops, algo deu errado</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              {params?.error ? (
                <p className="text-gray-700">Erro: {params.error}</p>
              ) : (
                <p className="text-gray-700">Ocorreu um erro não especificado durante a autenticação.</p>
              )}
              <p className="text-sm text-gray-600">
                Tente novamente ou entre em contato conosco se o problema persistir.
              </p>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full bg-turquoise hover:bg-turquoise/90 text-white">
                <Link href="/auth/login">Tentar novamente</Link>
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
