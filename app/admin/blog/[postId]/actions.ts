// c:\Projetos\psicologaattame\app\admin\blog\[postId]\actions.ts
"use server"

import { createClient } from "@/lib/supabase/server"
import { isAdmin } from "@/lib/auth-utils"

// Função para gerar um slug a partir do título
const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")
}

export async function upsertPost(formData: FormData) {
  const userIsAdmin = await isAdmin()
  if (!userIsAdmin) {
    return { success: false, message: "Acesso negado.", posts: null }
  }

  const supabase = await createClient()

  const id = formData.get("id") as string
  const title = formData.get("title") as string
  const status = formData.get("status") as "draft" | "published" | "archived"
  const imageFile = formData.get("image") as File | null

  const postData = {
    title: title,
    author_name: formData.get("author_name") as string,
    summary: formData.get("summary") as string,
    content: formData.get("content") as string,
    status: status,
    image_alt: formData.get("image_alt") as string,
  }

  let imageUrl: string | null = null

  // 1. Lidar com o upload da imagem
  if (imageFile && imageFile.size > 0) {
    const fileName = `${crypto.randomUUID()}-${imageFile.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("blog_images")
      .upload(fileName, imageFile)

    if (uploadError) {
      console.error("Erro no upload da imagem:", uploadError)
      return { success: false, message: "Falha ao fazer upload da imagem.", posts: null }
    }

    // Obter a URL pública da imagem
    const { data: publicUrlData } = supabase.storage.from("blog_images").getPublicUrl(uploadData.path, { download: false })
    imageUrl = publicUrlData.publicUrl
  }

  // 2. Preparar os dados para o upsert
  let dataToUpsert: any = { ...postData }
  if (imageUrl) {
    dataToUpsert.image_url = imageUrl
  }

  // Define a data de publicação apenas se o status for 'published' e não houver uma data anterior
  if (status === "published" && !dataToUpsert.published_at) {
    dataToUpsert.published_at = new Date().toISOString()
  }

  // 3. Executar o upsert (criar ou atualizar)
  if (id) {
    // Atualizar post existente
    const { error } = await supabase.from("posts").update(dataToUpsert).eq("id", id)
    if (error) {
      console.error("Erro ao atualizar post:", error)
      return { success: false, message: "Falha ao atualizar o post.", posts: null }
    }
  } else {
    // Criar novo post
    dataToUpsert.slug = generateSlug(title) // Gerar slug apenas na criação
    const { error } = await supabase.from("posts").insert(dataToUpsert).select()
    if (error) {
      console.error("Erro ao criar post:", error)
      // Tratar erro de slug duplicado, se necessário
      if (error.code === "23505") {
        return { success: false, message: "Já existe um post com este título. Por favor, escolha outro.", posts: null }
      }
      return { success: false, message: "Falha ao criar o post.", posts: null }
    }
  }

  // 4. Após salvar, busca todos os posts para retornar a lista atualizada
  const { data: updatedPosts, error: fetchError } = await supabase
    .from("posts")
    .select("id, title, author_name, created_at, status")
    .order("created_at", { ascending: false })

  if (fetchError) {
    return { success: false, message: "Post salvo, mas falha ao recarregar a lista.", posts: null }
  }

  return { success: true, message: "Post salvo com sucesso!", posts: updatedPosts }
}

export async function deletePost(postId: string) {
  const userIsAdmin = await isAdmin()
  if (!userIsAdmin) {
    return { success: false, message: "Acesso negado.", posts: null }
  }

  if (!postId) {
    return { success: false, message: "ID do post não fornecido.", posts: null }
  }

  const supabase = await createClient()

  // 1. Buscar o post para obter a URL da imagem antes de deletar
  const { data: post, error: fetchPostError } = await supabase.from("posts").select("image_url").eq("id", postId).single()

  if (fetchPostError) {
    console.error("Erro ao buscar post para deletar:", fetchPostError)
    return { success: false, message: "Post não encontrado.", posts: null }
  }

  // 2. Deletar o post da tabela
  const { error: deletePostError } = await supabase.from("posts").delete().eq("id", postId)

  if (deletePostError) {
    console.error("Erro ao deletar post:", deletePostError)
    return { success: false, message: "Falha ao deletar o post.", posts: null }
  }

  // 3. Se o post tinha uma imagem, deletá-la do Storage
  if (post.image_url) {
    const fileName = post.image_url.split("/").pop()
    if (fileName) {
      await supabase.storage.from("blog_images").remove([fileName])
    }
  }

  // 4. Retornar a lista de posts atualizada
  const { data: updatedPosts, error: fetchError } = await supabase
    .from("posts")
    .select("id, title, author_name, created_at, status")
    .order("created_at", { ascending: false })

  return { success: true, message: "Post deletado com sucesso!", posts: updatedPosts || [] }
}
