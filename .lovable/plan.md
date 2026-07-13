## Diagnóstico

O log mostra que `npm install` abortou com `ERESOLVE`: `react-leaflet@5.0.0` exige `react@^19`, mas o projeto usa `react@18.3.1`. O Bun (usado no Lovable) é tolerante a esse conflito, mas o npm no CI não é.

## Correção

Editar apenas `.github/workflows/deploy.yml`, trocando:

```yaml
run: npm install --no-audit --no-fund
```

por:

```yaml
run: npm install --no-audit --no-fund --legacy-peer-deps
```

Isso replica o comportamento tolerante do Bun e resolve o conflito de peer dependency do `react-leaflet` sem alterar versões do React (o `react-leaflet@5` funciona na prática com React 18 — o bloqueio é só a declaração de peer).

Alternativa considerada: fazer downgrade de `react-leaflet` para `^4`, que suporta React 18 oficialmente. Descartada para não mexer no código da aplicação (o `MapContainer.tsx` já está funcionando com a versão atual).

## Ações manuais suas

1. Após o sync Lovable → GitHub, abrir **Actions** e re-executar o workflow.
2. Se aparecer página em branco em `https://marloshb.github.io/eco-cost-calculator-geo/`, mandar o erro do console.