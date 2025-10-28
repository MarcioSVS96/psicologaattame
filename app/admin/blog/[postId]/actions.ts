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
  const contentImageFiles = formData.getAll("content_images[]") as File[]
  
  const postData = {
    title: title,
    author_name: formData.get("author_name") as string,
    summary: formData.get("summary") as string,
    content: formData.get("content") as string,
    status: status,
    image_alt: formData.get("image_alt") as string,
  }

  let featuredImageUrl: string | null = null
  const existingContentImages = JSON.parse(formData.get("existing_content_images") as string || "[]")

  // 1. Lidar com o upload da imagem de DESTAQUE
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
    featuredImageUrl = publicUrlData.publicUrl
  }

  // 2. Lidar com o upload das imagens de CONTEÚDO
  const newContentImages: { url: string; alt: string }[] = []
  for (const file of contentImageFiles) {
    if (file && file.size > 0) {
      const fileName = `${crypto.randomUUID()}-${file.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("blog_images")
        .upload(fileName, file)

      if (uploadError) {
        console.error("Erro no upload da imagem de conteúdo:", uploadError)
        return { success: false, message: "Falha ao fazer upload de uma das imagens de conteúdo.", posts: null }
      }

      const { data: publicUrlData } = supabase.storage.from("blog_images").getPublicUrl(uploadData.path)
      newContentImages.push({ url: publicUrlData.publicUrl, alt: `Imagem no conteúdo do post ${title}` })
    }
  }

  // 3. Preparar os dados para o upsert
  let dataToUpsert: any = { ...postData }
  if (featuredImageUrl) {
    dataToUpsert.image_url = featuredImageUrl
  }

  // Combina imagens existentes com as novas
  dataToUpsert.content_images = [...existingContentImages, ...newContentImages]

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
    .select("*") // Busca todos os campos para ter os dados completos no client-side
    .order("created_at", { ascending: false })

  if (fetchError) {
    return { success: false, message: "Post salvo, mas falha ao recarregar a lista.", posts: null }
  }

  return { success: true, message: "Post salvo com sucesso!", posts: updatedPosts }
}

export async function deleteContentImage(postId: string, imageUrl: string) {
  const userIsAdmin = await isAdmin()
  if (!userIsAdmin) {
    return { success: false, message: "Acesso negado." }
  }

  const supabase = await createClient()

  // 1. Buscar o post para obter a lista atual de imagens
  const { data: post, error: fetchError } = await supabase.from("posts").select("content_images").eq("id", postId).single()

  if (fetchError || !post) {
    return { success: false, message: "Post não encontrado." }
  }

  // 2. Filtrar a imagem a ser removida
  const currentImages = (post.content_images as { url: string; alt: string }[]) || []
  const updatedImages = currentImages.filter((img) => img.url !== imageUrl)

  // 3. Atualizar o post no banco de dados
  const { error: updateError } = await supabase.from("posts").update({ content_images: updatedImages }).eq("id", postId)

  if (updateError) {
    console.error("Erro ao remover imagem do post:", updateError)
    return { success: false, message: "Falha ao remover a imagem do post." }
  }

  // 4. Deletar a imagem do Storage
  const fileName = imageUrl.split("/").pop()
  if (fileName) {
    await supabase.storage.from("blog_images").remove([fileName])
  }

  return { success: true, message: "Imagem removida com sucesso.", updatedImages }
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
  const { data: post, error: fetchPostError } = await supabase.from("posts").select("image_url, content_images").eq("id", postId).single()

  if (fetchPostError) {
    console.error("Erro ao buscar post para deletar:", fetchPostError)
    return { success: false, message: "Post não encontrado.", posts: null }
  }

  // 2. Deletar as imagens do Storage
  const imagesToDelete: string[] = []
  if (post.image_url) {
    const fileName = post.image_url.split("/").pop()
    if (fileName) imagesToDelete.push(fileName)
  }
  if (post.content_images) {
    ;(post.content_images as { url: string }[]).forEach(img => {
      const fileName = img.url.split("/").pop()
      if (fileName) imagesToDelete.push(fileName)
    })
  }
  if (imagesToDelete.length > 0) {
    await supabase.storage.from("blog_images").remove(imagesToDelete)
  }

  // 3. Deletar o post da tabela
  const { error: deletePostError } = await supabase.from("posts").delete().eq("id", postId)

  if (deletePostError) {
    console.error("Erro ao deletar post:", deletePostError)
    return { success: false, message: "Falha ao deletar o post.", posts: null }
  }

  // 4. Retornar a lista de posts atualizada
  const { data: updatedPosts, error: fetchError } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })

  return { success: true, message: "Post deletado com sucesso!", posts: updatedPosts || [] }
}
