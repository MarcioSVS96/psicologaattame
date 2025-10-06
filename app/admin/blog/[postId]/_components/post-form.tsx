// c:\Projetos\psicologaattame\app\admin\blog\[postId]\_components\post-form.tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTransition } from "react"
import { toast } from "sonner"
import { upsertPost } from "../actions"
import { PostData } from "../page"
import Image from "next/image"

// Schema de validação com Zod
const postSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres."),
  author_name: z.string().min(3, "O nome do autor é obrigatório."),
  summary: z.string().min(10, "O resumo deve ter pelo menos 10 caracteres."),
  content: z.string().min(10, "O conteúdo é obrigatório."), // Simplificado para string por enquanto
  image: z.instanceof(File).optional(),
  image_alt: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]),
})

interface PostFormProps {
  post: PostData | null
}

export function PostForm({ post }: PostFormProps) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title || "",
      author_name: post?.author_name || "Beatriz Attame", // Valor padrão
      summary: post?.summary || "",
      content: post?.content || "", // Garantir que seja tratado como string pura
      image_alt: post?.image_alt || "",
      status: post?.status || "draft",
    },
  })

  const onSubmit = (values: z.infer<typeof postSchema>) => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append("id", post?.id || "")
      formData.append("title", values.title)
      formData.append("author_name", values.author_name)
      formData.append("summary", values.summary)
      formData.append("content", values.content)
      formData.append("status", values.status)
      if (values.image) {
        formData.append("image", values.image)
      }
      if (values.image_alt) {
        formData.append("image_alt", values.image_alt)
      }

      const result = await upsertPost(formData)

      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Conteúdo do Post</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tema (Título)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Como lidar com a ansiedade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resumo</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Um breve resumo que aparecerá na listagem do blog." {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conteúdo</FormLabel>
                      <FormControl>
                        {/* TODO: Substituir por um editor Rich Text (ex: TipTap) */}
                        <Textarea placeholder="Escreva o conteúdo completo do seu post aqui..." {...field} rows={15} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Coluna Lateral */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publicação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Rascunho</SelectItem>
                          <SelectItem value="published">Publicado</SelectItem>
                          <SelectItem value="archived">Arquivado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="author_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Autor</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-navy hover:bg-navy/90" disabled={isPending}>
                  {isPending ? "Salvando..." : post ? "Atualizar Post" : "Criar Post"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Imagem de Destaque</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {post?.image_url && (
                  <div className="relative w-full h-40 rounded-md overflow-hidden">
                    <Image src={post.image_url} alt={post.image_alt || "Imagem de destaque"} layout="fill" objectFit="cover" />
                  </div>
                )}
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enviar nova imagem</FormLabel>
                      <FormControl>
                        <Input type="file" accept="image/*" onChange={e => field.onChange(e.target.files ? e.target.files[0] : null)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image_alt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Texto alternativo da imagem</FormLabel>
                      <FormControl>
                        <Input placeholder="Descreva a imagem para acessibilidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  )
}
