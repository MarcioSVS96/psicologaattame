import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowLeft, ArrowRight, Calendar, User } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { SafeHTML } from "@/components/safe-html"
import { BannerSection } from "@/components/banner-section"

// Gera metadados dinâmicos (título e descrição) para a página, o que é ótimo para SEO.
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = await createClient()
  const { data: post } = await supabase
    .from("posts")
    .select("title, summary, image_url, author_name") // Adicionei image_url e author_name
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
    author: [{ name: post.author_name }],
    openGraph: {
      title: post.title,
      description: post.summary,
      url: `https://www.beatrizattame.com/blog/${params.slug}`, // URL canônica do post
      type: "article",
      images: post.image_url ? [{ url: post.image_url }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: post.image_url ? [post.image_url] : [],
    },
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
    .select('title, slug, summary, image_url, image_alt, published_at')
    .eq('status', 'published')
    .not('id', 'eq', post.id) // Exclui o post atual da lista
    .order('view_count', { ascending: false })
    .limit(3);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Seção do botão de voltar com fundo para destaque */}
          <div className="mb-8 bg-gray-50 p-2 rounded-lg inline-block">
            <Button asChild variant="ghost" size="sm" className="text-navy hover:bg-navy/10">
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
                fill // A classe 'object-cover' já está sendo aplicada via className
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1120px"
                priority
              />
            </div>
          )}

          {/* O 'prose' é uma classe que aplica estilos de tipografia para textos longos. Adicionei estilos básicos em globals.css */}
          {/* A classe 'whitespace-pre-wrap' preserva as quebras de linha e faz o wrap do texto */}
          <SafeHTML htmlContent={post.content} />
        </article>

        {/* Seção de Banner/CTA */}
        <section className="mt-16">
          <BannerSection
            imageUrl="/banner.webp"
            title="Acompanhamentos psicoterapêuticos."
            subtitle="100% Online"
            buttonText="Saiba Mais"
            buttonLink="https://wa.me/5581985712073"
          />
        </section>

        {/* Seção de Posts Populares */}
        {popularPosts && popularPosts.length > 0 && (
          <section className="py-16 lg:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl font-serif">Conteúdos mais acessados</h2>
                <p className="mt-4 text-lg leading-8 text-gray-600">
                  Veja outros artigos que podem te interessar.
                </p>
              </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularPosts.map((p) => (
                <div key={p.slug} className="flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-56 w-full">
                    <Image
                      src={p.image_url || "/placeholder.jpg"}
                      alt={p.image_alt || p.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover" />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <p className="text-sm text-gray-500">{p.published_at ? format(new Date(p.published_at), "dd 'de' MMMM, yyyy", { locale: ptBR }) : ""}</p>
                    <h3 className="mt-2 text-xl font-semibold text-navy leading-tight">{p.title}</h3>
                    <p className="mt-3 text-gray-600 line-clamp-3 flex-grow">{p.summary}</p>
                    <div className="mt-4">
                      <Button asChild variant="link" className="text-turquoise p-0">
                        <Link href={`/blog/${p.slug}`}>Ler mais <ArrowRight className="ml-2 h-4 w-4" /></Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}
