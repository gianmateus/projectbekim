# Credenciais de Acesso - Restaurant Financial Management System

## Credenciais de Login

### Administrador
- **Email:** `admin@restaurant.local`
- **Senha:** `RestaurantAdmin2024!`
- **Permissões:** Acesso total, pode criar novos restaurantes
- **ID Interno:** `admin-001`

### Gerente
- **Email:** `manager@restaurant.local`
- **Senha:** `RestaurantManager2024!`
- **Permissões:** Acesso aos restaurantes existentes
- **ID Interno:** `manager-001`

## Restaurantes Pré-configurados (Dados Isolados)

Cada restaurante possui dados completamente isolados e específicos:

### 1. La Bella Vista (Cozinha Italiana)
- **ID:** `restaurant-001`
- **Tipo:** Cozinha italiana autêntica
- **Endereço:** Hauptstraße 123, 10115 Berlin
- **Telefone:** +49 30 12345678
- **Email:** info@labellavista.de
- **Cor do tema:** #c54f42
- **Dados específicos:**
  - Receita diária: €2.485
  - Pedidos: 127
  - Fornecedores: Italian Imports, Vini d'Italia GmbH
  - Produtos: San Marzano Tomaten, Parmigiano Reggiano
  - Contas: Vinhos italianos, aluguel

### 2. Zur Goldenen Gans (Cozinha Alemã)
- **ID:** `restaurant-002`
- **Tipo:** Cozinha alemã tradicional
- **Endereço:** Friedrichstraße 456, 10117 Berlin
- **Telefone:** +49 30 87654321
- **Email:** kontakt@goldenengans.de
- **Cor do tema:** #d96d62
- **Dados específicos:**
  - Receita diária: €1.980
  - Pedidos: 89
  - Fornecedores: Augustiner Bräu, Fleischerei Müller
  - Produtos: Schweineschulter, Sauerkraut
  - Contas: Cerveja Augustiner, conta de luz

### 3. Sakura Sushi (Cozinha Japonesa)
- **ID:** `restaurant-003`
- **Tipo:** Sushi fresco e especialidades japonesas
- **Endereço:** Unter den Linden 789, 10117 Berlin
- **Telefone:** +49 30 11223344
- **Email:** info@sakurasushi.de
- **Cor do tema:** #6c798b
- **Dados específicos:**
  - Receita diária: €3.120
  - Pedidos: 156
  - Fornecedores: Tsukiji Fish Market, Japan Food Trading
  - Produtos: Sushi Reis, Nori Blätter
  - Contas: Atum fresco, serviços de limpeza

## Fluxo de Acesso com Dados Isolados

1. **Login:** Use as credenciais acima em `http://localhost:3000/login`
2. **Seleção de Restaurante:** Será redirecionado para `/restaurants`
3. **Escolher Restaurante:** Clique em qualquer um dos 3 restaurantes
4. **Dashboard Contextualizado:** Veja dados específicos do restaurante selecionado
5. **Troca de Restaurante:** Use "Restaurant wechseln" para comparar dados

## Funcionalidades de Dados Isolados

### Dashboard Dinâmico
- ✅ Estatísticas específicas por restaurante
- ✅ Alertas contextuais (estoque baixo, pagamentos pendentes)
- ✅ Inventário específico do tipo de cozinha
- ✅ Fornecedores adequados ao restaurante
- ✅ Formatação em euros (€)

### Endpoints da API
- `GET /api/dashboard/restaurant-001/data` - Dados do La Bella Vista
- `GET /api/dashboard/restaurant-002/data` - Dados do Zur Goldenen Gans
- `GET /api/dashboard/restaurant-003/data` - Dados do Sakura Sushi

## Níveis de Acesso

### Admin (`admin@restaurant.local`)
- ✅ Pode criar novos restaurantes
- ✅ Acesso a todos os restaurantes
- ✅ Vê dados isolados de cada restaurante
- ✅ Pode alternar entre restaurantes

### Manager (`manager@restaurant.local`)
- ❌ Não pode criar novos restaurantes
- ✅ Acesso aos restaurantes existentes
- ✅ Vê dados isolados de cada restaurante
- ✅ Pode alternar entre restaurantes

## URLs Importantes

- **Frontend:** http://localhost:3002 (Next.js rodando na 3002)
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/health
- **API Info:** http://localhost:3001/api

## Teste de Isolamento de Dados

Para testar se os dados estão realmente isolados:

### 1. Teste La Bella Vista (Italiano)
```bash
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:3001/api/dashboard/restaurant-001/data
```
Deve retornar: Tomates San Marzano, Parmigiano, fornecedores italianos

### 2. Teste Zur Goldenen Gans (Alemão)
```bash
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:3001/api/dashboard/restaurant-002/data
```
Deve retornar: Schweineschulter, Sauerkraut, cervejaria alemã

### 3. Teste Sakura Sushi (Japonês)
```bash
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:3001/api/dashboard/restaurant-003/data
```
Deve retornar: Arroz para sushi, Nori, fornecedores japoneses

## Segurança dos Dados Isolados

⚠️ **Validação de Acesso:**
- Cada endpoint valida se o usuário tem acesso ao restaurante
- IDs de restaurante são verificados antes de retornar dados
- Dados são completamente separados por restaurante
- Não há vazamento de dados entre restaurantes

## Como Alterar Dados Mockados

Para modificar os dados específicos de um restaurante:

1. Edite o arquivo `backend/src/utils/mockData.ts`
2. Modifique os dados do restaurante desejado
3. Reinicie o servidor backend
4. Os dados atualizados aparecerão no dashboard

## 🔧 Adicionando Novos Restaurantes

Para adicionar um novo restaurante com dados isolados:

1. **Backend:** Adicione dados em `mockData.ts`
2. **Restaurantes:** Adicione em `restaurants.ts`
3. **Credenciais:** Associe ao usuário apropriado

```javascript
// Exemplo de novo restaurante
const novoRestauranteMockData = {
  stats: {
    dailyRevenue: 1500.00,
    orders: 75,
    appointments: 6,
    weeklyProfit: 9800.00
  },
  // ... outros dados específicos
};
```

## 📝 Notas de Desenvolvimento

- **Dados Realistas:** Cada restaurante tem produtos condizentes com seu tipo
- **Fornecedores Específicos:** Adequados ao segmento de cada restaurante
- **Volumes Apropriados:** Baseados no tipo e localização do estabelecimento
- **Custos Reais:** Preços baseados no mercado alemão

## 🌍 Ambiente de Desenvolvimento

### Teste Rápido
1. Login: `admin@restaurant.local` / `RestaurantAdmin2024!`
2. Selecione "La Bella Vista" (italiano)
3. Observe produtos italianos no dashboard
4. Troque para "Sakura Sushi" (japonês)
5. Compare com produtos japoneses

### Verificação de Isolamento
- Cada restaurante mostra fornecedores únicos
- Produtos são específicos do tipo de cozinha  
- Estatísticas diferem entre restaurantes
- Alertas são contextuais (ex: "Nori niedrig" apenas no sushi)

O sistema agora oferece uma experiência completamente personalizada e isolada para cada restaurante! 🍝🍺🍣

## Segurança

⚠️ **AVISO DE DESENVOLVIMENTO:**
- Estas credenciais são apenas para desenvolvimento
- Os restaurantes são simulados (não há banco de dados real)
- Em produção, implemente sistema de cadastro adequado
- Altere as credenciais antes de deploy

## Como Alterar Credenciais

Para alterar as credenciais pré-configuradas:

1. Edite o arquivo `backend/src/utils/auth.ts`
2. Modifique o array `PREDEFINED_USERS`
3. Para restaurantes, edite `backend/src/utils/restaurants.ts`
4. Reinicie o servidor backend

## Dados de Sessão

O sistema armazena no localStorage:
- `token` - JWT de autenticação
- `user` - Dados do usuário logado
- `selectedRestaurant` - Restaurante atualmente selecionado

Para limpar a sessão completamente, remova estes itens do localStorage do navegador.

## 🛡️ Segurança

- As senhas estão criptografadas com bcrypt (salt rounds: 12)
- Tokens JWT com expiração de 7 dias
- Autenticação stateless
- Credenciais fixas no código (single-tenant)

## 🔧 Alteração de Credenciais

Para alterar as credenciais, modifique o arquivo:
```
backend/src/utils/auth.ts
```

### Gerando Novos Hashes
Se precisar gerar novos hashes de senha:

```javascript
const bcrypt = require('bcryptjs');

async function generateHash(password) {
  const hash = await bcrypt.hash(password, 12);
  console.log('Hash:', hash);
}

generateHash('NovaSenha123!');
```

## 📝 Notas de Desenvolvimento

- Durante o desenvolvimento, as senhas são verificadas diretamente (sem hash)
- Em produção, usar apenas verificação por hash
- Não compartilhar estas credenciais em ambientes não seguros
- Para adicionar novos usuários, editar manualmente o array `PREDEFINED_USERS`

## 🌍 Ambiente de Desenvolvimento

Para testes rápidos durante desenvolvimento:
- **Admin:** admin@restaurant.local / RestaurantAdmin2024!
- **Manager:** manager@restaurant.local / RestaurantManager2024! 