# Sistema de Seleção de Restaurante

## Visão Geral
O sistema agora inclui uma tela de seleção de restaurante estilo Netflix que aparece após o login, permitindo que o usuário escolha em qual restaurante deseja trabalhar.

## Fluxo de Navegação

### 1. Página Inicial (`/`)
- Verifica se o usuário está autenticado
- Verifica se há um restaurante selecionado
- Redireciona para a página apropriada:
  - `/login` - se não autenticado
  - `/restaurants` - se autenticado mas sem restaurante selecionado
  - `/dashboard` - se autenticado e com restaurante selecionado

### 2. Login (`/login`)
- Após login bem-sucedido, redireciona para `/restaurants`

### 3. Seleção de Restaurante (`/restaurants`)
- Exibe cards dos restaurantes disponíveis para o usuário
- Design responsivo estilo Netflix com:
  - Avatar colorido para cada restaurante
  - Informações do restaurante (nome, descrição, endereço, telefone, email)
  - Animações hover e loading
- Opção para adicionar novo restaurante (apenas admin)
- Seleção salva o restaurante no localStorage
- Após seleção, redireciona para `/dashboard`

### 4. Dashboard (`/dashboard`)
- Exibe informações do restaurante selecionado no header
- Botão para trocar de restaurante (limpa seleção e volta para `/restaurants`)
- Interface personalizada com contexto do restaurante

## Backend - API Endpoints

### Restaurantes
- `GET /api/restaurants` - Lista restaurantes do usuário
- `GET /api/restaurants/:id` - Detalhes de um restaurante
- `POST /api/restaurants` - Criar novo restaurante (admin apenas)
- `POST /api/restaurants/select` - Selecionar restaurante

## Restaurantes Pré-configurados

### La Bella Vista
- **Tipo:** Italiano
- **Endereço:** Hauptstraße 123, 10115 Berlin
- **Telefone:** +49 30 12345678
- **Cor:** #c54f42

### Zur Goldenen Gans
- **Tipo:** Alemão tradicional
- **Endereço:** Friedrichstraße 456, 10117 Berlin
- **Telefone:** +49 30 87654321
- **Cor:** #d96d62

### Sakura Sushi
- **Tipo:** Japonês
- **Endereço:** Unter den Linden 789, 10117 Berlin
- **Telefone:** +49 30 11223344
- **Cor:** #6c798b

## Funcionalidades

### Interface
- Design responsivo
- Animações suaves
- Estados de loading
- Cards interativos com hover effects
- Modal para criação de restaurante (placeholder)

### Segurança
- Verificação de autenticação via JWT
- Validação de acesso ao restaurante
- Middleware de autenticação

### Armazenamento
- Token JWT no localStorage
- Dados do usuário no localStorage
- Restaurante selecionado no localStorage

## Próximos Passos
1. Implementar formulário completo para criação de restaurante
2. Adicionar upload de logo para restaurantes
3. Implementar edição de restaurantes
4. Adicionar sistema de convites para outros usuários
5. Implementar múltiplos níveis de acesso por restaurante

## Notas Técnicas
- Todos os dados são armazenados em memória no backend (não há banco de dados real ainda)
- Relacionamentos entre usuários e restaurantes são simulados
- Sistema preparado para expansão futura com Prisma ORM 