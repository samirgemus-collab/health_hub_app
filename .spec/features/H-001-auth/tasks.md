# Tarefas — H-001: Autenticação Real Híbrida Fail-Closed & Controle de Acesso (RBAC)

- [x] **T-001**: Confirmação da proteção de `.env*` em `.gitignore` para prevenir vazar segredos. `Refs: CA-001`
- [x] **T-002**: Criação do módulo puro `src/lib/appMode.ts` com as funções `resolveAppMode` e `roleToPortal`. `Refs: CA-001, CA-002`
- [x] **T-003**: Refatoração do `src/lib/supabaseClient.ts` para remoção dos fallbacks demo hardcoded (fail-closed). `Refs: CA-001`
- [x] **T-004**: Atualização do `SegSaudeAuthModal.tsx` com chamada `signInWithPassword` real e limpeza de mocks/setTimesout. `Refs: CA-002`
- [x] **T-005**: Atualização do `Header.tsx` para ocultar os 4 botões de portal em modo real (`hidePortalSelector`) e exibir botão Sair. `Refs: CA-003`
- [x] **T-006**: Refatoração do `App.tsx` para suporte aos 3 modos (`real`, `demo`, `blocked`) e validação de `app_metadata.role`. `Refs: CA-001, CA-002, CA-003`
- [x] **T-007**: Instalação do Vitest (`npm i -D vitest`), inclusão do script `"test": "vitest run"` no `package.json` e do step no `.github/workflows/ci.yml`. `Refs: CA-004`
- [x] **T-008**: Criação dos testes unitários em `src/lib/appMode.test.ts` e validação da prova por mutação. `Refs: CA-004`
- [x] **T-009**: Documentação da especificação, decisões e tarefas em `.spec/features/H-001-auth/`. `Refs: CA-001`
