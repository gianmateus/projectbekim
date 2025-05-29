import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import {
  getRestaurants,
  getRestaurant,
  createNewRestaurant,
  updateRestaurant,
  selectRestaurant
} from '../controllers/restaurant.controller';

const router = Router();

// All restaurant routes require authentication
// Todas as rotas de restaurante requerem autenticação
router.use(authenticateToken);

// GET /api/restaurants - Get all restaurants for current user
// GET /api/restaurants - Obter todos os restaurantes para o usuário atual
router.get('/', getRestaurants);

// GET /api/restaurants/:restaurantId - Get specific restaurant
// GET /api/restaurants/:restaurantId - Obter restaurante específico
router.get('/:restaurantId', getRestaurant);

// POST /api/restaurants - Create new restaurant
// POST /api/restaurants - Criar novo restaurante
router.post('/', createNewRestaurant);

// PUT /api/restaurants/:restaurantId - Update restaurant
// PUT /api/restaurants/:restaurantId - Atualizar restaurante
router.put('/:restaurantId', updateRestaurant);

// POST /api/restaurants/select - Select a restaurant
// POST /api/restaurants/select - Selecionar um restaurante
router.post('/select', selectRestaurant);

export default router; 