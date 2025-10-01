import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ArrowRight, BookOpen } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default async function BlogPage() {
  const supabase = await createClient()

  const { data: posts, error } = await supabase
    .from("posts")
    .select("title, summary, image_url, image_alt, slug, published_at, author_name")
    .eq("status", "published")
    .order("published_at", { ascending: false })

  if (error) {
    console.error("Erro ao buscar os posts do blog:", error.message)
  }

  return (
    <div className="bg-warm-gray min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 pt-8">
            <h1 className="text-4xl font-bold tracking-tight text-navy sm:text-5xl font-serif">
              Blog
            </h1>
            <p className="mt-4 text-xl leading-8 text-gray-600">
              Artigos, dicas e reflexões para o seu bem-estar e autoconhecimento.
            </p>
          </div>

          {posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map(post => (
                <Card key={post.slug} className="flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="relative h-56 w-full">
                      <Image
                        src={post.image_url || "/placeholder-image.jpg"}
                        alt={post.image_alt || post.title}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  </Link>
                  <CardHeader>
                    <p className="text-sm text-gray-500">
                      {post.published_at ? format(new Date(post.published_at), "dd 'de' MMMM, yyyy", { locale: ptBR }) : ""}
                    </p>
                    <CardTitle className="text-xl font-semibold text-navy leading-tight">
                      <Link href={`/blog/${post.slug}`} className="hover:text-turquoise transition-colors">{post.title}</Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-gray-600 line-clamp-4">{post.summary}</p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="link" className="text-turquoise p-0">
                      <Link href={`/blog/${post.slug}`}>Ler mais <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum post publicado</h3>
              <p className="mt-1 text-sm text-gray-500">Volte em breve para conferir as novidades.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

