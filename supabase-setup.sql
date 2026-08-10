-- ============================================================
-- Passo a passo: cole tudo isso no SQL Editor do seu projeto
-- Supabase (https://supabase.com -> New Project -> SQL Editor)
-- ============================================================

-- 1) Tabela que guarda cada "story" das férias
create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text default 'geral',
  image_url text not null,
  created_at timestamp with time zone default now()
);

-- 2) Ativa segurança em nível de linha
alter table photos enable row level security;

-- 3) Como é um projeto escolar sem login, liberamos leitura e
--    inserção pública (qualquer um com o link pode ver e adicionar)
create policy "Leitura publica" on photos
  for select using (true);

create policy "Insercao publica" on photos
  for insert with check (true);

-- ============================================================
-- 4) Criar o bucket de imagens
-- Vá em Storage -> Create bucket -> nome: fotos -> marque "Public bucket"
-- Depois rode isto para liberar upload público no bucket:
-- ============================================================

insert into storage.buckets (id, name, public)
values ('fotos', 'fotos', true)
on conflict (id) do nothing;

create policy "Leitura publica fotos" on storage.objects
  for select using (bucket_id = 'fotos');

create policy "Upload publico fotos" on storage.objects
  for insert with check (bucket_id = 'fotos');
