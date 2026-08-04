# Decisões — H-001 (Auth Real Híbrida Fail-Closed & RBAC)

- **Arquitetura Híbrida Fail-Closed**:
  - `resolveAppMode` gerencia 3 modos: `'real'`, `'demo'`, `'blocked'`.
  - Se faltar variáveis de ambiente (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`) e `VITE_DEMO_MODE !== 'true'`, o sistema é BLOQUEADO (`'blocked'`). Nenhuma requisição demo vazará por padrão (eliminação do padrão fail-open F-001).
- **Papel de Usuário em `app_metadata.role` (POR QUÊ)**:
  - O papel do usuário (RBAC: `patient`, `doctor`, `healthcare_team`, `admin`) fica em `session.user.app_metadata.role` no Supabase.
  - *Razão*: `app_metadata` é gerenciado exclusivamente pelo servidor/admin Supabase (via Service Role API ou SQL Editor), impedindo que um usuário altere seu próprio papel no cliente (ao contrário de `user_metadata`, que é editável pelo próprio usuário via SDK).
- **Tratamento de Sessão sem Papel**:
  - Usuários autenticados no Supabase sem `app_metadata.role` válido recebem uma tela de erro "Acesso Bloqueado — Nenhum papel atribuído (contate o administrador)" com opção explícita de Logout.
- **Antecipação do Vitest**:
  - Instalado o Vitest em H-001 para validação da lógica pura de resolução de modo (`resolveAppMode`) e mapeamento de papéis (`roleToPortal`), garantindo prova executável desde a introdução da auth.
- **Remoção de Credenciais Hardcoded**:
  - Credenciais estáticas demo de `src/lib/supabaseClient.ts` foram 100% removidas.
