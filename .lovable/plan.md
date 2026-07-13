
# Publicar no GitHub Pages

O repositório é `marloshb/eco-cost-calculator-geo`, então a app ficará servida em:
`https://marloshb.github.io/eco-cost-calculator-geo/`

Como não é a raiz do domínio, precisamos ajustar 4 pontos: **base do Vite**, **basename do React Router**, **fallback SPA 404.html** e **workflow do GitHub Actions**.

---

## Alterações de código

### 1. `vite.config.ts` — definir `base`
Adicionar `base: "/eco-cost-calculator-geo/"` para que os assets buildados (`/assets/...`) apontem para o subpath do Pages. Em dev local o Vite continua servindo em `/`.

### 2. `src/App.tsx` — `basename` do BrowserRouter
Passar `basename={import.meta.env.BASE_URL}` no `<BrowserRouter>`. Assim as rotas (`/`, `/comparison`, `/tradeoffs`) funcionam tanto localmente (`/`) quanto no Pages (`/eco-cost-calculator-geo/`), e os `<Link>` já usados nas páginas continuam válidos sem alteração.

### 3. `public/404.html` — fallback SPA
GitHub Pages não tem fallback nativo para SPA. Vamos criar um `public/404.html` que redireciona para o `index.html` preservando o path (técnica do rafgraph/spa-github-pages). Junto disso, um pequeno script em `index.html` desempacota a rota original antes do React montar.

### 4. `index.html` — script de restauração da rota
Adicionar, dentro do `<head>` e antes do `main.tsx`, o script que lê o query param gerado pelo `404.html` e restaura a URL correta via `history.replaceState`.

### 5. `.github/workflows/deploy.yml` — GitHub Actions
Workflow que dispara em push para `main`:
- checkout
- setup Node 20
- `npm ci`
- `npm run build`
- `actions/upload-pages-artifact` apontando para `dist`
- `actions/deploy-pages`

Também copia o `dist/index.html` para `dist/404.html` no final do build (garante o fallback mesmo sem passar por `public/`).

### 6. `package.json`
Não precisa mudar scripts — `npm run build` já basta. (Sem `homepage`, isso é Create React App, não Vite.)

---

## Detalhes técnicos

**Por que `basename={import.meta.env.BASE_URL}`?**
O Vite injeta essa variável a partir do `base` do config. Em dev vale `/`, em prod vale `/eco-cost-calculator-geo/`. Assim o mesmo código funciona nos dois ambientes sem `if` manual.

**Como o 404.html funciona:**
Usuário abre `https://marloshb.github.io/eco-cost-calculator-geo/tradeoffs`. GitHub Pages não acha o arquivo, serve `404.html`. Esse HTML pega o path atual, empacota em `?/tradeoffs` e redireciona para `/eco-cost-calculator-geo/?/tradeoffs`. O script no `index.html` reescreve para `/eco-cost-calculator-geo/tradeoffs` antes do React Router iniciar. Refresh e deep links passam a funcionar.

**Cuidados:**
- Os assets locais (`src/assets/...`) importados via ES6 continuam funcionando — o Vite reescreve os paths com o `base`.
- Links externos absolutos (`<a href="/algo">`) quebrariam; a app não parece usar isso.
- O Leaflet carrega via `<script>` do CDN em `index.html`, então não é afetado pelo base.

---

## Ações manuais que VOCÊ precisa fazer (fora do Lovable)

1. **Ativar GitHub Pages via Actions**
   No repo: **Settings → Pages → Build and deployment → Source: GitHub Actions** (não escolha "Deploy from a branch").

2. **Conceder permissões ao workflow** (geralmente já vem por padrão, mas confirme)
   **Settings → Actions → General → Workflow permissions**:
   - "Read and write permissions" habilitado, ou
   - Deixar o workflow declarar `permissions: pages: write, id-token: write` (já incluso no yml que vou gerar).

3. **Fazer push do sync do Lovable → GitHub**
   Depois que eu aplicar as mudanças, o Lovable envia para o `main`. O workflow dispara sozinho.

4. **Aguardar o primeiro deploy**
   Aba **Actions** do repo → workflow "Deploy to GitHub Pages" → esperar concluir (~1-2 min). A URL final aparece em **Settings → Pages**.

5. **(Opcional) Domínio customizado**
   Se quiser um domínio próprio depois, configure em Settings → Pages → Custom domain e ajuste o `base` do Vite para `/` novamente.

6. **Publish do Lovable é separado**
   O botão "Publish" do Lovable continua publicando em `eco-cost-calculator-geo.lovable.app`. Os dois deploys coexistem — não interferem.

---

## Arquivos que serão criados/alterados

- `vite.config.ts` (editar — adicionar `base`)
- `src/App.tsx` (editar — adicionar `basename`)
- `index.html` (editar — script de restauração de rota)
- `public/404.html` (criar)
- `.github/workflows/deploy.yml` (criar)

Nada mais do código funcional muda; rotas, componentes e estilos permanecem iguais.
