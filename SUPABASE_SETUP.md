# Configuração do Supabase

## Passos para Configurar a Base de Dados

### 1. Criar a Tabela no Supabase

1. Acesse o seu projeto no [Supabase Dashboard](https://app.supabase.com)
2. Vá para a seção **SQL Editor**
3. Clique em **New Query**
4. Copie e cole todo o conteúdo do arquivo `database-schema.sql`
5. Clique em **Run** para executar o script

Isso irá criar:
- ✅ Tabela `timers` com todos os campos necessários
- ✅ Índices para melhorar a performance
- ✅ Trigger para atualizar automaticamente o campo `updated_at`
- ✅ Row Level Security (RLS) habilitado
- ✅ Políticas de acesso para leitura, inserção, atualização e exclusão

### 2. Verificar a Tabela

1. Vá para **Table Editor** no menu lateral
2. Você deve ver a tabela `timers` criada
3. Clique na tabela para ver sua estrutura

### 3. Credenciais já Configuradas

As credenciais do Supabase já estão configuradas no arquivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL="https://ycyqpwqlghxlsmirpbsa.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGci..."
```

### 4. Funcionalidades Implementadas

#### Sincronização em Tempo Real
- ✅ Quando você adiciona/edita/remove um cronómetro na página de controlo, ele aparece instantaneamente na projeção
- ✅ Múltiplos usuários podem usar o sistema simultaneamente
- ✅ Atualizações são sincronizadas automaticamente via Realtime do Supabase

#### Operações Disponíveis
- ✅ **Adicionar Cronómetro**: Cria um novo registro na tabela
- ✅ **Iniciar/Pausar**: Atualiza o status do cronómetro
- ✅ **Resetar**: Restaura o tempo restante ao tempo total
- ✅ **Deletar**: Remove o cronómetro da base de dados
- ✅ **Contagem Regressiva**: Atualiza automaticamente `remaining_seconds` a cada segundo

### 5. Estrutura da Tabela

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Identificador único (gerado automaticamente) |
| `name` | TEXT | Nome do cronómetro |
| `total_seconds` | INTEGER | Tempo total em segundos |
| `remaining_seconds` | INTEGER | Tempo restante em segundos |
| `status` | TEXT | Status: 'paused', 'running' ou 'finished' |
| `created_at` | TIMESTAMP | Data de criação (gerado automaticamente) |
| `updated_at` | TIMESTAMP | Data da última atualização (atualizado automaticamente) |

### 6. Testar a Conexão

Após executar o script SQL:

1. Reinicie o servidor Next.js (se estiver rodando)
2. Acesse http://localhost:3000
3. Adicione um cronómetro
4. Verifique no Supabase Dashboard → Table Editor → timers
5. Você deve ver o cronómetro criado na base de dados

### 7. Verificar Realtime

1. Abra duas janelas do browser:
   - Uma em http://localhost:3000 (página de controlo)
   - Outra em http://localhost:3000/projection (página de projeção)
2. Adicione um cronómetro na página de controlo
3. Ele deve aparecer instantaneamente na projeção! 🚀

## Solução de Problemas

### Erro: "Failed to load timers"
- Verifique se o script SQL foi executado corretamente
- Confirme que as políticas RLS estão ativas
- Verifique as credenciais no `.env.local`

### Cronómetros não aparecem
- Verifique o console do browser para erros
- Confirme que a tabela `timers` existe no Supabase
- Verifique se as políticas de RLS permitem leitura

### Realtime não funciona
- Confirme que o Realtime está habilitado no seu projeto Supabase
- Vá para **Database** → **Replication** e habilite a tabela `timers`

## Migração de localStorage para Supabase

Se você tinha cronómetros salvos no localStorage, eles não serão migrados automaticamente. A base de dados Supabase começará vazia. Você pode:

1. Criar novos cronómetros na interface
2. Ou, se precisar migrar dados antigos, entre em contato para criar um script de migração

## Próximos Passos

Agora o sistema está totalmente integrado com Supabase! 🎉

- ✅ Dados persistem na nuvem
- ✅ Sincronização em tempo real
- ✅ Múltiplos usuários podem acessar simultaneamente
- ✅ Backup automático pelo Supabase
