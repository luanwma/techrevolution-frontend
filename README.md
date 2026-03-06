# Gestor de Tarefas - Frontend

Frontend em React (JavaScript) para gerenciamento de tarefas com dois perfis:

- `GERENTE`: cria desenvolvedor, cria/edita/exclui tarefas, acompanha histórico e produtividade.
- `DESENVOLVEDOR`: inicia, pausa e finaliza tarefas com observações de execução.

## Recursos implementados

- Login único (`/login`) com redirecionamento por perfil.
- Rotas protegidas por permissões.
- Painel Kanban com drag-and-drop (`TODO`, `DOING`, `DONE`).
- Botões de ação nas tarefas (play, pause, finalizar).
- Observação obrigatória ao pausar/finalizar tarefa.
- Dashboard de produtividade com `Chart.js`:
  - tarefas por desenvolvedor;
  - tempo de produção por desenvolvedor.
- Histórico completo para gerente, incluindo filtro por desenvolvedor e histórico por tarefa.
- Modelos JavaScript para `Usuario`, `UsuarioTarefa`, `Tarefa` e `Historico`.

## Endpoints integrados

- `POST /login`
- `POST /api/gerente/registro/desenvolvedor`
- `POST /api/tarefas/criar`
- `PUT /api/tarefas/editar/{tarefaId}`
- `DELETE /api/tarefas/deletar/{tarefaId}/`
- `GET /api/tarefas/dashboard`
- `POST /api/tarefas/{tarefaId}/iniciar`
- `POST /api/tarefas/{tarefaId}/pausar`
- `POST /api/tarefas/{tarefaId}/finalizar`
- `GET /api/historico/gerente`
- `GET /api/historico/desenvolvedor/{executorId}`
- `GET /api/historico/tarefa/{tarefaId}`

## Como rodar

1. Instale dependências:

```bash
npm install
```

2. Crie arquivo `.env` baseado no exemplo:

```bash
cp .env.example .env
```

3. Ajuste a URL da API no `.env`:

```env
VITE_API_URL=http://localhost:8080
```

4. Rode em desenvolvimento:

```bash
npm run dev
```

5. Build de produção:

```bash
npm run build
```
