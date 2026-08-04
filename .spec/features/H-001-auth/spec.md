# Especificação — H-001: Autenticação Real Híbrida Fail-Closed & Controle de Acesso (RBAC)

> **Feature**: H-001-auth  
> **Objetivo**: Implementar a autenticação real com Supabase em modo híbrido fail-closed, remoção de credenciais demo hardcoded do cliente, restrição de acesso por papel (`app_metadata.role`) e suíte de testes unitários com Vitest.

## Critérios de Aceite

### CA-001 Resolução de Modo Fail-Closed (`resolveAppMode`)
- Dado o ambiente de execução da aplicação.
- Quando `VITE_DEMO_MODE=true` estiver presente, o aplicativo opera em modo `'demo'` com banner fixo de alerta.
- Quando `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estiverem presentes (sem a flag demo), o aplicativo opera em modo `'real'`.
- Quando nenhuma env ou envs parciais forem fornecidas, o aplicativo opera em modo `'blocked'` (fail-closed).

### CA-002 Autenticação Real & Leitura de Papel (`app_metadata.role`)
- Dado o aplicativo operando em modo `'real'`.
- Quando um usuário tentar autenticar via e-mail e senha no `SegSaudeAuthModal`, a chamada executa `supabase.auth.signInWithPassword`.
- Se o login for bem-sucedido, o portal correspondente ao papel (`patient`, `doctor`, `healthcare_team`, `admin`) gravado em `session.user.app_metadata.role` é exibido.
- Se o papel for ausente ou inválido, a tela exibe aviso de bloqueio por falta de papel com botão de Logout.

### CA-003 Remoção de Troca de Portal Irrestrita
- Dado um usuário autenticado no modo `'real'`.
- Quando estiver navegando pela aplicação, o seletor manual dos 4 portais no Header é ocultado (`hidePortalSelector=true`).
- O usuário visualiza apenas o portal autorizado pelo seu papel e possui botão explícito de "Sair".

### CA-004 Testes Unitários de Lógica Pura
- Dado a suíte de testes Vitest (`npm run test`).
- Quando executado `vitest run`, todos os cenários da lógica de resolução de modo (`resolveAppMode`) e mapeamento de papéis (`roleToPortal`) passam com status VERDE.
- Em caso de mutação (ex: alterar `return 'blocked'` para `return 'demo'`), os testes reprovam.
