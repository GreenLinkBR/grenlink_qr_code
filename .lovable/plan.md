## Objetivo

Fazer o `vite build` gerar um site **100% estático** em `dist/` com `index.html` na raiz, pronto para subir em `public_html` da Hostinger (via GitHub) — eliminando o erro 403.

## Causa do 403

O template atual compila com **TanStack Start + Nitro (target Cloudflare Workers)**. A saída é um bundle de servidor, não um site estático — não existe `index.html` na raiz do build. O Apache da Hostinger, sem index, responde **403 Forbidden**.

A Hostinger compartilhada só serve estático. Precisamos de uma SPA Vite tradicional.

## Mudanças

### 1. `vite.config.ts` — trocar o preset Lovable por Vite puro
Remover `@lovable.dev/vite-tanstack-config` (que injeta Nitro/Cloudflare) e usar:
- `@vitejs/plugin-react`
- `@tanstack/router-plugin/vite` (gera `routeTree.gen.ts` igual)
- `@tailwindcss/vite`
- `vite-tsconfig-paths`
- `build.outDir = "dist"` (padrão)

### 2. `index.html` na raiz do projeto
Criar `index.html` com `<div id="root">` e `<script type="module" src="/src/main.tsx">`, incluindo as metatags SEO que hoje vivem em `__root.tsx`.

### 3. `src/main.tsx` — novo entrypoint client-side
```ts
ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
```

### 4. `src/routes/__root.tsx` — remover shell SSR
Tirar `shellComponent`, `HeadContent`, `Scripts`, `<html>/<body>`. Manter só `component`, `errorComponent`, `notFoundComponent`. Metatags vão para `index.html`.

### 5. Apagar peças de servidor (não usadas)
- `src/server.ts`
- `src/start.ts`
- `src/lib/error-capture.ts`, `src/lib/error-page.ts`
- `src/lib/config.server.ts`
- `src/lib/api/example.functions.ts` e pasta `src/routes/api/`
- Dependências: `@tanstack/react-start`, `nitro`, `@lovable.dev/vite-tanstack-config`

### 6. `package.json`
- `build`: `vite build` (continua igual, mas agora produz estático)
- Remover deps de servidor acima
- Adicionar `@vitejs/plugin-react` (já dev dep) — ok

### 7. SPA fallback para a Hostinger
Criar `public/.htaccess` com regra para rotas client-side (senão `/auth`, `/dashboard` dão 404 ao recarregar):
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### 8. Auth Supabase
O fluxo Supabase é totalmente client-side (`@supabase/supabase-js` com localStorage) — funciona sem mudanças. Lembrar de adicionar o domínio Hostinger em **Supabase → Auth → URL Configuration** (Site URL e Redirect URLs).

## Resultado

`vite build` gera:
```
dist/
  index.html        ← Apache serve isso por padrão (sem 403)
  .htaccess         ← fallback SPA para rotas internas
  assets/*.js,*.css
```

Você sobe o conteúdo de `dist/` para `public_html/` na Hostinger (ou aponta o deploy do GitHub para essa pasta).

## Trade-offs

- **Sem SSR / sem server functions**: ok, o projeto não usa nenhuma.
- **Sem preview Lovable com SSR**: o preview continua funcionando como SPA normal.
- **SEO**: metatags ficam em `index.html` (estáticas, sem variação por rota). Suficiente para esse app.
