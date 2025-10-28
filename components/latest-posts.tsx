import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ArrowRight } from "lucide-react"

export async function LatestPosts() {
  const supabase = await createClient()

  const { data: posts, error } = await supabase
    .from("posts")
    .select("title, summary, image_url, image_alt, slug, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(3)

  if (error) {
    console.error("Erro ao buscar os últimos posts:", error.message)
    return null
  }

  if (!posts || posts.length === 0) {
    // Não renderiza a seção se não houver posts publicados
    return null
  }

  return (
    <section className="py-16 lg:py-24 bg-warm-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl font-serif">
            Últimas do Blog
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Artigos e reflexões para o seu bem-estar e autoconhecimento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <Card key={post.slug} className="flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-56 w-full">
                <Image
                  src={post.image_url || "/placeholder-image.jpg"}
                  alt={post.image_alt || post.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <CardHeader>
                <p className="text-sm text-gray-500">
                  {post.published_at ? format(new Date(post.published_at), "dd 'de' MMMM, yyyy", { locale: ptBR }) : ""}
                </p>
                <CardTitle className="text-xl font-semibold text-navy leading-tight">{post.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-gray-600 line-clamp-3">{post.summary}</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="link" className="text-turquoise p-0">
                  <Link href={`/blog/${post.slug}`}>Ler mais <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}