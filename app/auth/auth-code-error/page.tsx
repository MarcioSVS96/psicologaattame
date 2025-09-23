import Link from "next/link"

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-warm-gray flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Erro de Autenticação</h1>
      <p className="text-gray-700 mb-6">
        Ocorreu um problema ao tentar fazer login. Por favor, tente novamente.
      </p>
      <Link href="/auth/login" className="text-turquoise hover:underline font-medium">
        Voltar para a página de Login
      </Link>
    </div>
  )
}

