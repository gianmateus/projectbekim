# Sistema de Dados Isolados por Restaurante

## Visão Geral
Cada restaurante agora possui seus próprios dados completamente isolados, incluindo finanças, inventário, compras e eventos. Isso garante que as informações de um restaurante não interfiram com as de outro.

## Implementação Backend

### 1. Dados Mockados Específicos (`backend/src/utils/mockData.ts`)

#### La Bella Vista (Restaurante Italiano)
- **ID:** `restaurant-001`
- **Foco:** Cozinha italiana autêntica
- **Dados específicos:**
  - Contas a pagar: Vinhos italianos, aluguel
  - Inventário: San Marzano tomates, Parmigiano Reggiano
  - Fornecedores: Italian Imports, Caseificio Romano
  - Estatísticas: €2.485 diário, 127 pedidos

#### Zur Goldenen Gans (Restaurante Alemão)
- **ID:** `restaurant-002`
- **Foco:** Cozinha alemã tradicional
- **Dados específicos:**
  - Contas a pagar: Cerveja Augustiner, conta de luz
  - Inventário: Schweineschulter, Sauerkraut
  - Fornecedores: Augustiner Bräu, Fleischerei Müller
  - Estatísticas: €1.980 diário, 89 pedidos

#### Sakura Sushi (Restaurante Japonês)
- **ID:** `restaurant-003`
- **Foco:** Sushi fresco e especialidades japonesas
- **Dados específicos:**
  - Contas a pagar: Atum fresco, serviços de limpeza
  - Inventário: Arroz para sushi, folhas de nori
  - Fornecedores: Tsukiji Fish Market, Japan Food Trading
  - Estatísticas: €3.120 diário, 156 pedidos

### 2. API Endpoints Específicos

#### Dashboard por Restaurante
```
GET /api/dashboard/:restaurantId/stats
GET /api/dashboard/:restaurantId/data
GET /api/dashboard/:restaurantId/accounts
GET /api/dashboard/:restaurantId/inventory
```

### 3. Validação de Acesso
- Cada endpoint valida se o usuário tem acesso ao restaurante específico
- IDs de restaurante são verificados antes de retornar dados
- Dados são completamente isolados entre restaurantes

## Frontend - Dashboard Contextualizado

### 1. Dados Dinâmicos
- Dashboard carrega dados específicos do restaurante selecionado
- Estatísticas, alertas e inventário são únicos para cada restaurante
- Interface se adapta ao contexto do restaurante (cores, nome, etc.)

### 2. Componentes Atualizados
- **Header:** Exibe informações do restaurante atual com avatar colorido
- **Stats Cards:** Mostram métricas específicas (receita, pedidos, etc.)
- **Alert Cards:** Alertas contextuais (pagamentos em atraso, estoque baixo)
- **Quick Preview:** Resumo das contas e inventário do restaurante

### 3. Funcionalidades Específicas
- Formatação de moeda em euros (€)
- Status de pagamentos em alemão
- Alertas baseados nos dados reais do restaurante
- Navegação entre restaurantes mantém contexto

## Dados Específicos por Restaurante

### La Bella Vista (Italiano)
```json
{
  "stats": {
    "dailyRevenue": 2485.00,
    "orders": 127,
    "appointments": 8,
    "weeklyProfit": 15420.00
  },
  "specialties": ["Vinhos italianos", "Tomates San Marzano", "Parmigiano"],
  "suppliers": ["Italian Imports", "Vini d'Italia GmbH"]
}
```

### Zur Goldenen Gans (Alemão)
```json
{
  "stats": {
    "dailyRevenue": 1980.00,
    "orders": 89,
    "appointments": 5,
    "weeklyProfit": 12750.00
  },
  "specialties": ["Cerveja Augustiner", "Schweineschulter", "Sauerkraut"],
  "suppliers": ["Augustiner Bräu", "Fleischerei Müller"]
}
```

### Sakura Sushi (Japonês)
```json
{
  "stats": {
    "dailyRevenue": 3120.00,
    "orders": 156,
    "appointments": 12,
    "weeklyProfit": 18900.00
  },
  "specialties": ["Atum fresco", "Arroz para sushi", "Nori"],
  "suppliers": ["Tsukiji Fish Market", "Japan Food Trading"]
}
```

## Benefícios da Implementação

### 1. Isolamento Completo
- Dados financeiros separados por restaurante
- Inventário específico para cada tipo de cozinha
- Fornecedores adequados ao tipo de restaurante
- Eventos e calendário personalizados

### 2. Realismo dos Dados
- Produtos condizentes com o tipo de cozinha
- Fornecedores especializados
- Volumes de vendas apropriados para cada segmento
- Custos reais baseados no mercado alemão

### 3. Escalabilidade
- Fácil adição de novos restaurantes
- Estrutura preparada para diferentes tipos de cozinha
- Sistema flexível para expansão futura

## Como Testar

### 1. Login e Seleção
1. Faça login com: `admin@restaurant.local`
2. Selecione um dos 3 restaurantes disponíveis
3. Observe os dados específicos no dashboard

### 2. Troca de Restaurante
1. No dashboard, clique em "Restaurant wechseln"
2. Selecione um restaurante diferente
3. Compare os dados e estatísticas

### 3. Validação de Dados
- Cada restaurante tem fornecedores únicos
- Produtos são específicos do tipo de cozinha
- Estatísticas refletem o perfil do restaurante

## URLs de Teste

- **Frontend:** http://localhost:3002 (ou 3000 se disponível)
- **Backend:** http://localhost:3001
- **Health Check:** http://localhost:3001/health
- **API Dashboard:** http://localhost:3001/api/dashboard/restaurant-001/data

## Próximos Passos

1. **Implementar CRUD:** Adicionar, editar e remover itens específicos
2. **Relatórios:** Gerar relatórios contextuais por restaurante
3. **Comparativo:** Dashboard para comparar performance entre restaurantes
4. **Histórico:** Manter histórico de mudanças por restaurante
5. **Backup:** Sistema de backup específico por restaurante

O sistema agora oferece uma experiência completamente personalizada para cada restaurante, mantendo dados isolados e contextualizados. 