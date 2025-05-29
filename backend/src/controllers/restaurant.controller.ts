import { Request, Response } from 'express';
import { 
  getRestaurantsForUser, 
  getRestaurantById, 
  createRestaurant, 
  updateRestaurantData,
  validateRestaurantAccess 
} from '../utils/restaurants';

// Interface for authenticated request - Interface para requisição autenticada
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

// Get all restaurants for the current user
// Obter todos os restaurantes para o usuário atual
export const getRestaurants = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ 
        success: false, 
        message: 'Benutzer nicht authentifiziert' 
      });
      return;
    }

    const restaurants = getRestaurantsForUser(req.user.id);
    
    res.json({
      success: true,
      data: restaurants,
      message: 'Restaurants erfolgreich abgerufen'
    });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Fehler beim Abrufen der Restaurants' 
    });
  }
};

// Get a specific restaurant by ID
// Obter um restaurante específico por ID
export const getRestaurant = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ 
        success: false, 
        message: 'Benutzer nicht authentifiziert' 
      });
      return;
    }

    const { restaurantId } = req.params;
    const restaurant = getRestaurantById(restaurantId, req.user.id);

    if (!restaurant) {
      res.status(404).json({ 
        success: false, 
        message: 'Restaurant nicht gefunden' 
      });
      return;
    }

    res.json({
      success: true,
      data: restaurant,
      message: 'Restaurant erfolgreich abgerufen'
    });
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Fehler beim Abrufen des Restaurants' 
    });
  }
};

// Create a new restaurant
// Criar um novo restaurante
export const createNewRestaurant = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ 
        success: false, 
        message: 'Benutzer nicht authentifiziert' 
      });
      return;
    }

    const { name, description, address, phone, email, color } = req.body;

    // Validate required fields - Validar campos obrigatórios
    if (!name || !address) {
      res.status(400).json({ 
        success: false, 
        message: 'Name und Adresse sind erforderlich' 
      });
      return;
    }

    const newRestaurant = createRestaurant({
      name,
      description,
      address,
      phone,
      email,
      color
    }, req.user.id);

    res.status(201).json({
      success: true,
      data: newRestaurant,
      message: 'Restaurant erfolgreich erstellt'
    });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized to create restaurants') {
      res.status(403).json({ 
        success: false, 
        message: 'Keine Berechtigung zum Erstellen von Restaurants' 
      });
      return;
    }

    res.status(500).json({ 
      success: false, 
      message: 'Fehler beim Erstellen des Restaurants' 
    });
  }
};

// Update an existing restaurant
// Atualizar um restaurante existente
export const updateRestaurant = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ 
        success: false, 
        message: 'Benutzer nicht authentifiziert' 
      });
      return;
    }

    const { restaurantId } = req.params;
    const { name, description, address, phone, email, color } = req.body;

    console.log('🔄 Updating restaurant:', { restaurantId, userId: req.user.id, name });

    // Validate required fields - Validar campos obrigatórios
    if (!name || !address) {
      res.status(400).json({ 
        success: false, 
        message: 'Name und Adresse sind erforderlich' 
      });
      return;
    }

    // Validate that user has access to this restaurant
    // Validar que o usuário tem acesso a este restaurante
    const hasAccess = validateRestaurantAccess(restaurantId, req.user.id);
    
    if (!hasAccess) {
      res.status(403).json({ 
        success: false, 
        message: 'Kein Zugriff auf dieses Restaurant' 
      });
      return;
    }

    const updatedRestaurant = updateRestaurantData(restaurantId, {
      name,
      description,
      address,
      phone,
      email,
      color
    }, req.user.id);

    if (!updatedRestaurant) {
      res.status(404).json({ 
        success: false, 
        message: 'Restaurant nicht gefunden' 
      });
      return;
    }

    console.log('✅ Restaurant updated successfully:', updatedRestaurant);

    res.json({
      success: true,
      data: updatedRestaurant,
      message: 'Restaurant erfolgreich aktualisiert'
    });
  } catch (error) {
    console.error('Error updating restaurant:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized to update restaurant') {
      res.status(403).json({ 
        success: false, 
        message: 'Keine Berechtigung zum Aktualisieren des Restaurants' 
      });
      return;
    }

    res.status(500).json({ 
      success: false, 
      message: 'Fehler beim Aktualisieren des Restaurants' 
    });
  }
};

// Select a restaurant (set it as current restaurant in session)
// Selecionar um restaurante (definir como restaurante atual na sessão)
export const selectRestaurant = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ 
        success: false, 
        message: 'Benutzer nicht authentifiziert' 
      });
      return;
    }

    const { restaurantId } = req.body;

    if (!restaurantId) {
      res.status(400).json({ 
        success: false, 
        message: 'Restaurant-ID ist erforderlich' 
      });
      return;
    }

    // Validate that user has access to this restaurant
    // Validar que o usuário tem acesso a este restaurante
    const hasAccess = validateRestaurantAccess(restaurantId, req.user.id);
    
    if (!hasAccess) {
      res.status(403).json({ 
        success: false, 
        message: 'Kein Zugriff auf dieses Restaurant' 
      });
      return;
    }

    const restaurant = getRestaurantById(restaurantId, req.user.id);

    res.json({
      success: true,
      data: {
        selectedRestaurant: restaurant,
        user: req.user
      },
      message: 'Restaurant erfolgreich ausgewählt'
    });
  } catch (error) {
    console.error('Error selecting restaurant:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Fehler beim Auswählen des Restaurants' 
    });
  }
}; 