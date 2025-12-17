# Verificar e Habilitar Realtime no Supabase

## Passo 1: Habilitar Realtime

1. Acesse: https://app.supabase.com/project/ycyqpwqlghxlsmirpbsa/database/replication

2. Procure pela tabela `timers` na lista

3. Ative o toggle/switch ao lado de `timers` (deve ficar verde/azul)

## Passo 2: Verificar se a Tabela Existe

1. Acesse: https://app.supabase.com/project/ycyqpwqlghxlsmirpbsa/editor

2. Você deve ver a tabela `timers` na lista de tabelas

3. Se não vê, execute novamente o script `database-schema.sql`

## Passo 3: Testar no Console

Abra o console do navegador (F12) e verifique:

### Na página de controlo (localhost:3000):
- ✅ Deve aparecer: `Supabase configurado: https://ycyqpwqlghxlsmirpbsa.supabase.co`
- ✅ Ao adicionar cronómetro: `Cronómetros carregados: X`

### Na página de projeção (localhost:3000/projection):
- ✅ Deve aparecer: `Projeção: Cronómetros carregados: X`
- ✅ Deve aparecer: `Status da subscrição Realtime: SUBSCRIBED`
- ✅ Ao pausar/iniciar na página de controlo: `Projeção: Atualização recebida: ...`

## Mudanças Implementadas

Agora a projeção:
1. ✅ Carrega dados do Supabase ao iniciar
2. ✅ Subscreve ao Realtime para receber atualizações instantâneas
3. ✅ **FALLBACK**: Recarrega dados a cada 2 segundos (caso Realtime não esteja funcionando)
4. ✅ Atualiza contagem regressiva localmente para cronómetros em execução

## Se Ainda Não Funcionar

Verifique no console se aparece algum destes erros:
- `relation "public.timers" does not exist` → A tabela não foi criada
- `status: CHANNEL_ERROR` → Realtime não está habilitado
- `status: TIMED_OUT` → Problema de conexão com Supabase

Compartilhe comigo os erros que aparecem no console!
