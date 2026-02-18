# Frontend (Next.js) — Leidy Cleaner

Resumo rápido para desenvolvedores:

- Framework: Next.js (App Router)
- React 19, TypeScript, TailwindCSS
- API: usa `NEXT_PUBLIC_API_URL` para apontar para o backend

Comandos úteis:

```bash
cd frontend
npm ci         # instalar dependências
npm run dev     # iniciar dev server
npm run build   # build para produção
npm start       # start server (após build)
npm test        # rodar testes unitários (Jest)
```

Testes:

- Unitários: Jest + @testing-library/react
- E2E: Playwright (configurado)

Onde editar:

- Layout principal: `src/app/layout.tsx`
- Rotas/pages: `src/app/*`
- Componentes: `src/components/*`
- Api client: `src/services/api.ts`

Ajuda rápida para novos devs: siga `SETUP_GUIDE.md` para instruções detalhadas de setup local.
