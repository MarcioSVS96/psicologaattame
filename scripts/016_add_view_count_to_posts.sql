-- 016_add_view_count_to_posts.sql

-- 1. Adiciona a coluna para contar as visualizações na tabela de posts.
-- O valor padrão é 0.
ALTER TABLE public.posts
ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0 NOT NULL;

-- 2. Cria uma função RPC para incrementar o contador de visualizações de forma atômica.
-- Isso evita condições de corrida (race conditions) onde duas visualizações simultâneas
-- poderiam resultar em apenas um incremento.
CREATE OR REPLACE FUNCTION public.increment_post_view(post_id uuid)
RETURNS void AS $$
  SET search_path = public;
  UPDATE public.posts
  SET view_count = view_count + 1
  WHERE id = post_id;
$$ LANGUAGE sql VOLATILE;

-- 3. Altera o tipo da coluna 'content' de jsonb para text.
-- Isso simplifica a manipulação do conteúdo no formulário e na renderização,
-- resolvendo problemas de quebra de linha e formatação.
ALTER TABLE public.posts ALTER COLUMN content TYPE text;