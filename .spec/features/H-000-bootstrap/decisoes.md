# Decisões — H-000 (bootstrap / migração do onpspec)

- **MIGRAR onpspec.** Método ativo = `.spec/` + GitHub Actions CI. O motor onp-spec NÃO é o gate.
- **Baseline commitado** em master @ 56df002 (30 arquivos de WIP: 14 mod + 16 untracked). Nada perdido.
- **P-001** = CI verde. Baseline H-000 = build+lint, sem teste de comportamento (não há suíte). Dentes de comportamento na H-002.
- **P-002** migrado com glob corrigido (`src/**/*.{ts,tsx,js,jsx}`); não forçado no CI até a H-003 (que remove os demo creds do supabaseClient.ts e fixa a checagem).
- **onpspec.config.json REMOVIDO** — nada do app/CI/npm o lia (só o motor da skill; `git grep` confirmou 7 ocorrências, todas internas ao motor). testCommand (build+lint) absorvido pelo ci.yml.
- **.agents/onp-spec-driven MANTIDO** como documentação de referência; NÃO é o gate.
