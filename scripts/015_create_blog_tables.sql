-- 015_create_blog_tables.sql

-- 1. Tabela para armazenar os posts do blog
CREATE TABLE IF NOT EXISTS public.posts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    published_at timestamp with time zone,
    title text NOT NULL,
    slug text NOT NULL UNIQUE,
    author_name text NOT NULL,
    summary text NOT NULL,
    content jsonb, -- Para conteúdo rich text (ex: TipTap)
    image_url text,
    image_alt text,
    status text DEFAULT 'draft'::text NOT NULL CHECK (status IN ('draft', 'published', 'archived'))
);

-- 2. Bucket de armazenamento para as imagens do blog
-- Vá até a seção "Storage" do seu projeto Supabase e crie um bucket público chamado 'blog_images'.
-- As políticas abaixo permitirão a leitura pública e o acesso de escrita para o administrador.

-- Política para leitura pública das imagens
CREATE POLICY "Public read access for blog images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog_images');

-- Política para administradores poderem gerenciar imagens
CREATE POLICY "Admin can manage blog images"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'blog_images' AND public.is_admin_user(auth.uid()))
WITH CHECK (bucket_id = 'blog_images' AND public.is_admin_user(auth.uid()));


-- 3. Políticas de Acesso à Tabela (RLS)
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Política para administradores terem acesso total
CREATE POLICY "Admin has full access to posts" ON public.posts
FOR ALL USING (public.is_admin_user(auth.uid())) WITH CHECK (public.is_admin_user(auth.uid()));

-- Política para visitantes poderem ler apenas posts publicados
CREATE POLICY "Public can view published posts" ON public.posts
FOR SELECT TO public USING (status = 'published' AND published_at <= now());
