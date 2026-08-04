# Especificação — H-000: Bootstrap do Método Spec-Driven + CI Mínimo

> **Feature**: H-000-bootstrap  
> **Objetivo**: Instalar o método spec-driven e o portão de CI (GitHub Actions) no projeto `health_hub_app` (uma plataforma 100% mock, sem backend real conectado e fora de produção), absorvendo e migrando a estrutura legada do `onpspec`.

## Critérios de Aceite

### CA-001 Estrutura `.spec/` Ativa
- Dado que o repositório foi migrado do `onpspec` v1.1.0 para o nosso método spec-driven.
- Quando inspecionado o diretório `.spec/`.
- Então `.spec/constituicao.md` define P-001 (CI verde) e P-002 (glob corrigido), e `.spec/features/H-000-bootstrap/` contém `spec.md`, `decisoes.md` e `tasks.md`.

### CA-002 Workflow de CI Configurado no GitHub Actions
- Dado o repositório `health_hub_app`.
- Quando um Pull Request for aberto ou alterado na branch `master`.
- Então o GitHub Actions executa `.github/workflows/ci.yml` com os passos `npm ci`, `npm run build` e `npm run lint`, saindo com status verde (exit code 0).

### CA-003 Remoção Segura do Config Legado `onpspec.config.json`
- Dado o arquivo de configuração legado `onpspec.config.json`.
- Quando for removido do repositório via `git rm`.
- Então o projeto continua compilando (`npm run build`) e validando o linter (`npm run lint`) sem nenhuma dependência quebrada.

### CA-004 Revisão Sem Bloqueantes
- Dado o PR contendo a branch `spec/h-000-bootstrap`.
- Quando for submetido à revisão adversarial do Claude.
- Então deve receber aprovação do portão sem itens bloqueantes antes de qualquer merge.
