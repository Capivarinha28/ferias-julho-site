# As Férias de Julho — Site

Site estático (HTML/CSS/JS puro) que lista fotos das férias e permite
adicionar novas fotos, salvando tudo no Supabase — o mesmo banco que
o app mobile lê. Assim, ao adicionar uma foto pelo site, ela aparece
automaticamente no app.

## 1. Criar o backend gratuito (Supabase)

1. Crie uma conta grátis em https://supabase.com e um novo projeto.
2. Vá em **SQL Editor**, cole o conteúdo de `supabase-setup.sql` e rode.
3. Vá em **Project Settings -> API** e copie:
   - `Project URL`
   - `anon public key`
4. Cole esses dois valores em `config.js`, nas variáveis
   `SUPABASE_URL` e `SUPABASE_ANON_KEY`.

## 2. Testar localmente (opcional)

Basta abrir `index.html` no navegador, ou rodar um servidor simples:

```
npx serve .
```

## 3. Publicar de graça na internet (Vercel)

1. Crie uma conta grátis em https://vercel.com (dá pra logar com GitHub).
2. Suba esta pasta para um repositório no GitHub.
3. No Vercel: **Add New -> Project -> importe o repositório**.
4. Como é um site estático, não precisa configurar build command
   (deixe em branco / "Other"). Clique em **Deploy**.
5. Pronto — o Vercel te dá uma URL pública gratuita
   (ex: `ferias-de-julho.vercel.app`).

Nenhum desses passos tem custo no plano gratuito do Supabase nem do Vercel.
