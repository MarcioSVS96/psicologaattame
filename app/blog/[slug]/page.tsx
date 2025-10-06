import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowLeft, Calendar, User } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"

// Gera metadados dinâmicos (título e descrição) para a página, o que é ótimo para SEO.
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = await createClient()
  const { data: post } = await supabase
    .from("posts")
    .select("title, summary")
    .eq("slug", params.slug)
    .single()

  if (!post) {
    return {
      title: "Post não encontrado",
      description: "O post que você está procurando não existe ou foi movido.",
    }
  }

  return {
    title: `${post.title} | Blog Beatriz Attame`,
    description: post.summary,
  }
}

export default async function PostDetailPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", params.slug)
    .eq("status", "published") // Garante que apenas posts publicados sejam acessíveis
    .single()

  // Se o post não for encontrado (ou não estiver publicado), exibe a página 404 padrão do Next.js
  if (error || !post) {
    notFound()
  }

  // Incrementa o contador de visualizações do post de forma assíncrona
  // Não bloqueia a renderização da página
  if (post.id) {
    supabase.rpc('increment_post_view', { post_id: post.id }).then(({ error }) => {
      if (error) {
        console.error('Error incrementing post view count:', error.message);
      }
    });
  }

  // Busca os 3 posts mais populares (excluindo o atual)
  const { data: popularPosts } = await supabase
    .from('posts')
    .select('title, slug, summary, image_url, image_alt')
    .eq('status', 'published')
    .not('id', 'eq', post.id) // Exclui o post atual da lista
    .order('view_count', { ascending: false })
    .limit(3);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Button asChild variant="ghost" size="sm" className="-ml-4 text-navy hover:bg-navy/10">
              <Link href="/blog">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para o Blog
              </Link>
            </Button>
          </div>

          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-navy font-serif mb-4">{post.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1.5" />
                <span>{post.author_name}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1.5" />
                <time dateTime={post.published_at}>
                  {format(new Date(post.published_at), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                </time>
              </div>
            </div>
          </header>

          {post.image_url && (
            <div className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden mb-8 shadow-lg">
              <Image
                src={post.image_url}
                alt={post.image_alt || post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* O 'prose' é uma classe que aplica estilos de tipografia para textos longos. Adicionei estilos básicos em globals.css */}
          {/* A classe 'whitespace-pre-wrap' preserva as quebras de linha e faz o wrap do texto */}
          <div className="prose prose-lg max-w-full text-gray-800 leading-relaxed whitespace-pre-wrap break-words">
            {post.content}
          </div>
        </article>

        {/* Seção de Banner/CTA */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="bg-warm-gray rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-navy mb-3">Pronta para iniciar sua jornada?</h2>
            <p className="text-gray-600 mb-6">
              Agende uma conversa inicial para explorarmos como posso te ajudar a encontrar equilíbrio e bem-estar.
            </p>
            <Link href="/agendamento" className={buttonVariants({ size: 'lg', className: "bg-turquoise hover:bg-turquoise/90 text-white" })}>
              Agendar Consulta
            </Link>
          </div>
        </section>

        {/* Seção de Posts Populares */}
        {popularPosts && popularPosts.length > 0 && (
          <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
            <h2 className="text-2xl font-bold text-navy mb-6 border-b pb-3">Conteúdos mais acessados</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {popularPosts.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
                  <div className="relative h-32 w-full overflow-hidden rounded-t-lg">
                    <Image src={p.image_url || '/placeholder.jpg'} alt={p.image_alt || p.title} fill className="object-cover" />
                  </div>
                  <div className="p-4"><h3 className="font-semibold text-navy group-hover:text-turquoise transition-colors">{p.title}</h3></div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}
