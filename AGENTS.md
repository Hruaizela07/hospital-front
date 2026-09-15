# Repository guidance

## Project overview

Hospital frontend built with React 19, TypeScript, React Router 7, Vite, and
Tailwind CSS 4. React Router is configured for SPA mode (`ssr: false`).
Use pnpm; `package.json` pins pnpm 10.29.3 and `pnpm-lock.yaml` is the lockfile.

## Commands

- `pnpm install` — install dependencies.
- `pnpm dev` — start the development server on port 3000.
- `pnpm typecheck` — generate route types, then run TypeScript.
- `pnpm lint` — run ESLint.
- `pnpm lint:fix` — run ESLint with fixes; `pnpm format` is the same command.
- `pnpm test` — run `tests/apollo-client.test.mjs` using Node's test runner.
- `pnpm build:production` — create the production build.
- `pnpm build:staging` — build with `NODE_ENV=test`.
- `pnpm codegen` — generate GraphQL artifacts using the configured schema.
- `CODEGEN_USE_LOCAL_SCHEMA=true pnpm codegen` — generate using the local
  `schema.graphql`, without fetching the backend schema.

For initial environment setup, use `.env.example` as a template for
`.env.development`; preserve any existing local values.

## Structure and conventions

- `app/routes.ts` uses `flatRoutes()` for filesystem routing. Follow existing
  `app/routes/<route-name>/route.tsx` and standalone route file conventions.
- Keep page-specific components, hooks, types, and GraphQL operations beside
  their route. Move reusable code into shared directories when needed.
- `app/root.tsx` owns the document layout and shared Apollo, Nuqs, tooltip,
  and toast setup.
- `app/components/ui/` contains the existing shadcn/Base UI primitives;
  reuse these for forms, buttons, dialogs, and other controls.
- `app/components/common/` holds shared application components.
- `app/hooks/`, `app/lib/`, and `app/types/` hold reusable hooks, helpers,
  and types respectively.
- Use `~/` imports for modules under `app/` and type-only imports where
  appropriate. TypeScript strict mode is enabled.
- Follow the existing two-space indentation, single quotes, and no-semicolon
  style. ESLint uses the Antfu configuration and Tailwind class rules.
- Global styling and theme tokens live in `app/app.css`. Use the existing
  Tailwind utilities and `cn` helper from `~/lib/utils`.
- Some directory READMEs contain illustrative Zod examples, but Zod is not
  currently declared as a dependency. Check `package.json` before using it.

## GraphQL and authentication

- Shared operations live in `app/graphql/`; existing operations use `gql`
  from `@apollo/client`. React components use Apollo hooks through the root
  provider. See `app/graphql/README.md` for usage.
- `app/lib/graphql-client.ts` exports `createApolloClient({ token? })`.
  Preserve its cookie credentials, per-request XSRF token, single retry after
  HTTP 419, multipart upload handling, and authentication/maintenance redirects.
- Runtime requests target `${VITE_BASE_URL}/arsi`. Codegen selects its remote
  schema from `CODEGEN_SCHEMA_URL` or `VITE_BASE_GRAPHQL_URL`.
- `app/gql/` contains generated artifacts; regenerate rather than hand-editing.
  Remote codegen also refreshes `schema.graphql`. Local schema selection is
  controlled by `CODEGEN_USE_LOCAL_SCHEMA` and `CODEGEN_SCHEMA_FILE`.
- Keep credentials out of source and logs. Vite exposes `VITE_*` variables to
  client code; do not use them to store private secrets.

## Validation and change scope

- Run `pnpm typecheck` and `pnpm lint` for application changes. Run `pnpm test`
  for Apollo client or authentication transport changes; the current test
  suite covers that area rather than the whole UI.
- Run `pnpm build:production` when changing build configuration or integration
  behavior. Verify visible UI changes in the browser when available.
- Report check failures and distinguish existing issues from introduced ones.
- Do not hand-edit build output in `build/` or generated route types in
  `.react-router/`. Avoid unrelated formatting and preserve ongoing edits.
- Git hooks run `pnpm lint-staged` before commits and enforce Conventional
  Commits through commitlint.
