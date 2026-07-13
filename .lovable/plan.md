## Problema

O deploy quebrou em **`npm ci`**, não no build do Vite. Motivo: `npm ci` exige que `package-lock.json` esteja 100% sincronizado com `package.json`. Como este projeto é gerenciado pelo Bun no Lovable (o `bun.lockb` é o lockfile "de verdade"), o `package-lock.json` do repo fica frequentemente defasado — qualquer nova dependência (ex.: `jspdf`, `html2canvas`, `@types/leaflet`) faz o `npm ci` abortar com `EUSAGE`.

O aviso sobre Node 20 é apenas um *warning* de deprecação das actions e não causa exit 1, mas vale atualizar junto.

## Correção

Ajustar somente `.github/workflows/deploy.yml`:

1. Trocar `npm ci` por `npm install --no-audit --no-fund`.
   - Tolerante ao lockfile fora de sync.
   - Alternativa considerada: usar Bun no workflow (`oven-sh/setup-bun` + `bun install` + `bun run build`). Descartada para manter o pipeline simples e igual ao que o Lovable já espera.
2. Manter `cache: npm` no `setup-node` (funciona com `npm install`).
3. Subir as actions que ainda usam Node 20 para versões atuais:
   - `actions/checkout@v4` → `@v5`
   - `actions/setup-node@v4` → `@v5` (com `node-version: 22`)
   - `actions/configure-pages@v5` (já ok)
   - `actions/upload-pages-artifact@v3` (já ok)
   - `actions/deploy-pages@v4` (já ok)

Nenhum outro arquivo muda. `vite.config.ts`, `src/App.tsx`, `index.html`, `public/404.html` continuam como estão.

## Ações manuais suas

1. Após o sync do Lovable → GitHub, abrir a aba **Actions** e re-executar o workflow (ou fazer um commit vazio para disparar).
2. Se o build passar mas a página aparecer em branco em `https://marloshb.github.io/eco-cost-calculator-geo/`, abrir o console do navegador e me mandar o erro — geralmente é caminho de asset e ajusto o `base`.
