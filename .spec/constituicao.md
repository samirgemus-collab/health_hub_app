# Constituição — health_hub_app

> Método spec-driven. MIGRADO do onpspec v1.1.0 em H-000 (2026-08-04).
> Gate ATIVO = GitHub Actions CI (.github/workflows/ci.yml). O motor onp-spec NÃO é o gate — arquivado.

## Princípios

### P-001 [DEVE] Todo requisito tem prova executável
Nenhuma feature é declarada pronta sem o CI do GitHub Actions verde no PR.
- verificação(gate): `.github/workflows/ci.yml` verde.
- Baseline H-000: o gate é `npm ci && npm run build && npm run lint` — compilação + Oxlint, SEM teste de comportamento (não há suíte ainda). Registro consciente: hoje prova que compila e linta, não que funciona. P-001 ganha dentes de comportamento na H-002 (Vitest).

### P-002 [RECOMENDADO] Segredos nunca em código
Chaves e senhas vêm de variáveis de ambiente, nunca hard-coded.
- verificação(proibido): regex `(api[_-]?key|senha|password)\s*[:=]\s*['"][^'"]{8,}` em `src/**/*.{ts,tsx,js,jsx}` (glob corrigido — o original `src/**/*.js` não casava nada num projeto TS/React).
- NÃO forçado no CI ainda: ativá-lo agora reprovaria nos demo creds conhecidos (`src/lib/supabaseClient.ts`). Remover os creds + fixar essa checagem no CI é a H-003.

## Fluxo
spec → tarefas → implementação → CI verde (prova) → revisão adversarial (revisor ≠ autor) → merge só com SHA de merge confirmado.
