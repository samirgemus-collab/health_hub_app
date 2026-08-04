# Tarefas — H-000: Bootstrap do Método Spec-Driven + CI Mínimo

- [x] **T-001**: Atualização da constituição em `.spec/constituicao.md` para o padrão Spec-Driven com P-001 (CI verde) e P-002 (glob de segredos corrigido). `Refs: CA-001`
- [x] **T-002**: Registro do documento de decisões em `.spec/features/H-000-bootstrap/decisoes.md`. `Refs: CA-001`
- [x] **T-003**: Criação da especificação da feature em `.spec/features/H-000-bootstrap/spec.md`. `Refs: CA-001`
- [x] **T-004**: Remoção do arquivo estático de configuração legado `onpspec.config.json` via `git rm`. `Refs: CA-003`
- [x] **T-005**: Criação do pipeline de CI em `.github/workflows/ci.yml` com validação de build e lint. `Refs: CA-002`
- [x] **T-006**: Validação local executando `npm ci && npm run build && npm run lint`. `Refs: CA-002`
- [x] **T-007**: Abertura de Pull Request e aguardo da revisão adversarial do portão (Claude). `Refs: CA-004`
