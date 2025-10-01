// c:\Projetos\psicologaattame\app\admin\blog\[postId]\page.tsx
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { isAdmin } from "@/lib/auth-utils"
import { PostForm } from "./_components/post-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// Tipagem para os dados do post
export type PostData = {
  id: string
  title: string
  author_name: string
  summary: string
  content: any // JSONB
  image_url: string | null
  image_alt: string | null
  status: "draft" | "published" | "archived"
  published_at: string | null
}

export default async function EditPostPage({ params }: { params: { postId: string } }) {
  const userIsAdmin = await isAdmin()
  if (!userIsAdmin) {
    redirect("/dashboard")
  }

  const { postId } = params
  const isNew = postId === "new"
  let post: PostData | null = null

  if (!isNew) {
    const supabase = await createClient()
    const { data, error } = await supabase.from("posts").select("*").eq("id", postId).single()

    if (error || !data) {
      console.error("Post não encontrado:", error)
      redirect("/admin/blog")
    }
    post = data
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-4 -ml-4 text-navy hover:bg-navy/10">
          <Link href="/admin/blog">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Posts
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-navy">{isNew ? "Criar Novo Post" : "Editar Post"}</h1>
        <p className="text-gray-600 mt-1">{isNew ? "Preencha os detalhes abaixo para criar um novo artigo." : "Atualize as informações do post."}</p>
      </div>

      <PostForm post={post} />
    </div>
  )
}
