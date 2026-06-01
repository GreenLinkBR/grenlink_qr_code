## GreenLink QR Gerador — Plano de Build

App TanStack Start + React + Tailwind para gerar, customizar, baixar e salvar QR Codes, com Supabase (seu projeto) para auth e persistência.

### 1. Setup
- Conectar seu Supabase via Connectors (você será solicitado a colar URL + chaves do projeto).
- Instalar deps: `qr-code-styling`, `qrcode`, `sonner` (lucide-react e supabase-js já no template).
- Tema verde (#1A6B3C / #F0F7F4 / DM Sans) em `src/styles.css` via tokens oklch. Tailwind classes só via tokens semânticos.

### 2. Rotas (TanStack file-based)
- `/` → HomePage (gerador, público)
- `/auth` → Login/Signup
- `/_authenticated/dashboard` → "Meus QR Codes"
- `/_authenticated/qr/$id` → Detalhe/edição
- `_authenticated.tsx` layout com `beforeLoad` redirect se não logado
- `__root.tsx` com header dinâmico + listener `onAuthStateChange` para invalidar cache

### 3. Auth (Supabase)
- AuthPage: tabs Entrar / Criar Conta, email+senha, Google OAuth (`signInWithOAuth({provider:'google'})`), link "Esqueci minha senha", validação em PT-BR.
- Rota `/reset-password` para fluxo de recuperação.
- Após login → `/dashboard`. Após signup → mensagem "Verifique seu e-mail".
- Você precisará habilitar provider Google no painel do seu Supabase.

### 4. Banco (migrations no seu Supabase)
Tabela `profiles` (id uuid PK FK auth.users, email, full_name, avatar_url, created_at) + trigger `handle_new_user` para auto-criar no signup. RLS: usuário lê/atualiza só o próprio.

Tabela `qr_codes` (id, user_id FK, title, qr_type, content_data jsonb, design_config jsonb, preview_url, created_at, updated_at). RLS: todas as ops escopadas a `auth.uid()`. Índices em user_id e created_at DESC. GRANTs corretos para authenticated/service_role.

Bucket Storage `qr-previews`: leitura pública, escrita autenticada, max 2MB, png/svg, path `{user_id}/{qr_id}.png`.

### 5. Componentes do gerador
- **Header**: logo + nav, estados logado/deslogado.
- **QRTypeSelector**: 15 tipos (Link, Texto, E-mail, Ligação, SMS, V-Card, WhatsApp, Wi-Fi, PDF, App, Imagens, Video, Redes Sociais, Evento, Código de Barras). Desktop = grid de pills, mobile = scroll horizontal.
- **DynamicForm**: campos por tipo com validação inline e contadores; gera string codificada (ex: `WIFI:T:WPA;S:ssid;P:pwd;;`, `BEGIN:VCARD...`, `mailto:`, `tel:`, `SMSTO:`, `BEGIN:VEVENT`, etc.).
- **QRPreview**: `qr-code-styling` com debounce 300ms, placeholder quando vazio, download PNG ≥1000×1000 (`greenlink-qr-[timestamp].png`).
- **DesignCustomizer**: tabs Frame (9 opções) / Shape (dot type + corner type + 2 color pickers) / Logo (upload PNG/SVG ≤2MB, slider tamanho 10–30%, remover).
- **SaveQRButton**: visível só se logado; insere em `qr_codes` + sobe preview no Storage; toasts via sonner.

### 6. Dashboard
- Header "Meus QR Codes" + botão "Criar Novo QR".
- Stats: Total / Mês atual / Último criado.
- Grid responsivo (3/2/1 colunas) de cards com preview, título editável inline, badge de tipo colorido, data, ações Download/Edit/Delete (modal confirmação).
- Empty state com ilustração + CTA. Skeleton no loading. Modal "ver conteúdo + copiar".
- Fetch via `useSuspenseQuery` + loader, ordenado por `created_at DESC`.

### 7. Responsivo
- Desktop ≥1024px: 2 colunas (60/40), preview sticky.
- Mobile ≤768px: stack único, FAB sticky bottom de download, inputs ≥16px, touch targets ≥44px.

### 8. SEO/Meta
- `head()` por rota com title/description/og em PT-BR. Index com title "GreenLink QR Gerador — Crie QR Codes Grátis Online".

### Detalhes técnicos
- `qr-code-styling` renderizado client-side (sem SSR — usar dynamic guard).
- Sanitização de inputs antes de codificar (strip `<script>`, limites de tamanho).
- Cliente Supabase: `@/integrations/supabase/client` em browser; queries do dashboard via loader chamando o cliente do browser dentro do `_authenticated` (sessão já hidratada). Sem necessidade de service-role.
- `onAuthStateChange` no `__root.tsx` invalida query cache e router.

### O que você precisa fazer
1. Aprovar este plano.
2. Quando eu solicitar, selecionar/criar a conexão Supabase no picker.
3. Habilitar Google provider no painel do Supabase (opcional, posso ajudar com instruções).

### Fora de escopo deste build
- Frames decorativos elaborados com texto "SCAN ME" (vou implementar versão simples; os 9 frames serão variações de moldura básica).
- Facebook/GitHub OAuth.
