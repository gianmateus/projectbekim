// Pre-configured restaurants for the system - Restaurantes pré-configurados do sistema
let PREDEFINED_RESTAURANTS = [
  {
    id: 'restaurant-001',
    name: 'La Bella Vista',
    description: 'Authentische italienische Küche im Herzen der Stadt',
    address: 'Hauptstraße 123, 10115 Berlin',
    phone: '+49 30 12345678',
    email: 'info@labellavista.de',
    color: '#c54f42',
    ownerId: 'admin-001'
  },
  {
    id: 'restaurant-002', 
    name: 'Zur Goldenen Gans',
    description: 'Traditionelle deutsche Küche und gemütliche Atmosphäre',
    address: 'Friedrichstraße 456, 10117 Berlin',
    phone: '+49 30 87654321',
    email: 'kontakt@goldenengans.de',
    color: '#d96d62',
    ownerId: 'admin-001'
  },
  {
    id: 'restaurant-003',
    name: 'Sakura Sushi',
    description: 'Frisches Sushi und japanische Spezialitäten',
    address: 'Unter den Linden 789, 10117 Berlin',
    phone: '+49 30 11223344',
    email: 'info@sakurasushi.de',
    color: '#6c798b',
    ownerId: 'admin-001'
  },
  {
    id: 'restaurant-004',
    name: 'Le Jardin Français',
    description: 'Cuisine française raffinée avec vue sur le jardin',
    address: 'Kurfürstendamm 88, 10709 Berlin',
    phone: '+49 30 55667788',
    email: 'bonjour@lejardin.de',
    color: '#8b4a9c',
    ownerId: 'admin-001'
  },
  {
    id: 'restaurant-005',
    name: 'Mumbai Spice Palace',
    description: 'Authentische indische Küche mit traditionellen Gewürzen',
    address: 'Alexanderplatz 12, 10178 Berlin',
    phone: '+49 30 99887766',
    email: 'namaste@mumbaipalace.de',
    color: '#e67e22',
    ownerId: 'admin-001'
  },
  {
    id: 'restaurant-006',
    name: 'El Mariachi Loco',
    description: 'Mexikanische Küche mit Live-Musik und Tequila-Bar',
    address: 'Kreuzberg Straße 45, 10965 Berlin',
    phone: '+49 30 44556677',
    email: 'hola@elmariachi.de',
    color: '#f39c12',
    ownerId: 'admin-001'
  },
  {
    id: 'restaurant-007',
    name: 'The Burger Factory',
    description: 'Premium Burger und Craft Beer in industriellem Ambiente',
    address: 'Prenzlauer Berg 67, 10405 Berlin',
    phone: '+49 30 22334455',
    email: 'info@burgerfactory.de',
    color: '#34495e',
    ownerId: 'admin-001'
  }
];

// Array para armazenar novos restaurantes criados
let CREATED_RESTAURANTS: any[] = [];

// Function to get all predefined restaurants for a user
// Função para obter todos os restaurantes pré-definidos para um usuário
export const getRestaurantsForUser = (userId: string) => {
  // For now, return all restaurants for admin users
  // Por enquanto, retornar todos os restaurantes para usuários admin
  if (userId === 'admin-001' || userId === 'manager-001') {
    const allRestaurants = [...PREDEFINED_RESTAURANTS, ...CREATED_RESTAURANTS];
    return allRestaurants.map(restaurant => ({
      ...restaurant,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
  }
  
  return [];
};

// Function to get a specific restaurant by ID
// Função para obter um restaurante específico por ID
export const getRestaurantById = (restaurantId: string, userId: string) => {
  const restaurants = getRestaurantsForUser(userId);
  return restaurants.find(r => r.id === restaurantId) || null;
};

// Function to create a new restaurant (for admin users)
// Função para criar um novo restaurante (para usuários admin)
export const createRestaurant = (restaurantData: {
  name: string;
  description?: string;
  address: string;
  phone?: string;
  email?: string;
  color?: string;
}, userId: string) => {
  // Only admin users can create restaurants for now
  // Apenas usuários admin podem criar restaurantes por enquanto
  if (userId !== 'admin-001') {
    throw new Error('Unauthorized to create restaurants');
  }

  const newRestaurant = {
    id: `restaurant-${Date.now()}`,
    name: restaurantData.name,
    description: restaurantData.description,
    address: restaurantData.address,
    phone: restaurantData.phone,
    email: restaurantData.email,
    color: restaurantData.color || '#d96d62',
    ownerId: userId,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Add to created restaurants array
  CREATED_RESTAURANTS.push(newRestaurant);
  
  console.log('New restaurant created:', newRestaurant);
  
  return newRestaurant;
};

// Function to update restaurant data
// Função para atualizar dados do restaurante
export const updateRestaurantData = (restaurantId: string, updateData: {
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  color?: string;
}, userId: string) => {
  console.log('🔄 Updating restaurant data:', { restaurantId, updateData, userId });

  // Only admin users can update restaurants for now
  // Apenas usuários admin podem atualizar restaurantes por enquanto
  if (userId !== 'admin-001') {
    throw new Error('Unauthorized to update restaurant');
  }

  // Find restaurant in predefined list
  const predefinedIndex = PREDEFINED_RESTAURANTS.findIndex(r => r.id === restaurantId);
  if (predefinedIndex !== -1) {
    const updatedRestaurant = {
      ...PREDEFINED_RESTAURANTS[predefinedIndex],
      ...updateData
    };
    PREDEFINED_RESTAURANTS[predefinedIndex] = updatedRestaurant;
    console.log('✅ Updated predefined restaurant:', updatedRestaurant);
    return {
      ...updatedRestaurant,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  // Find restaurant in created list
  const createdIndex = CREATED_RESTAURANTS.findIndex(r => r.id === restaurantId);
  if (createdIndex !== -1) {
    const updatedRestaurant = {
      ...CREATED_RESTAURANTS[createdIndex],
      ...updateData,
      updatedAt: new Date()
    };
    CREATED_RESTAURANTS[createdIndex] = updatedRestaurant;
    console.log('✅ Updated created restaurant:', updatedRestaurant);
    return updatedRestaurant;
  }

  console.log('❌ Restaurant not found for update:', restaurantId);
  return null;
};

// Function to validate restaurant access for user
// Função para validar acesso ao restaurante para usuário
export const validateRestaurantAccess = (restaurantId: string, userId: string): boolean => {
  console.log('🔍 Validating restaurant access:', { restaurantId, userId });
  
  const restaurant = getRestaurantById(restaurantId, userId);
  const hasAccess = restaurant !== null;
  
  console.log('🎯 Restaurant access result:', { 
    restaurantId, 
    userId, 
    hasAccess,
    restaurant: restaurant ? { id: restaurant.id, name: restaurant.name } : null
  });
  
  return hasAccess;
}; 