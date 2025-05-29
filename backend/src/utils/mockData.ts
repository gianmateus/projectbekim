// Mock data specific to each restaurant - Dados mockados específicos para cada restaurante
interface RestaurantMockData {
  accounts: {
    payable: any[];
    receivable: any[];
  };
  inventory: any[];
  purchases: any[];
  events: any[];
  stats: {
    dailyRevenue: number;
    orders: number;
    appointments: number;
    weeklyProfit: number;
  };
}

// La Bella Vista (Italian Restaurant) - Restaurante Italiano
const laBellaVistaMockData: RestaurantMockData = {
  accounts: {
    payable: [
      {
        id: 'pay-001',
        description: 'Lieferung italienischer Weine',
        amount: 850.00,
        dueDate: '2024-12-15',
        status: 'PENDING',
        category: 'FOOD_SUPPLIES',
        vendor: 'Vini d\'Italia GmbH'
      },
      {
        id: 'pay-002', 
        description: 'Miete Dezember 2024',
        amount: 3200.00,
        dueDate: '2024-12-01',
        status: 'PAID',
        category: 'RENT',
        vendor: 'Immobilien Berlin KG'
      }
    ],
    receivable: [
      {
        id: 'rec-001',
        description: 'Catering Firmenfeier',
        amount: 1250.00,
        dueDate: '2024-12-20',
        status: 'PENDING',
        category: 'CATERING',
        customer: 'Tech Solutions GmbH'
      }
    ]
  },
  inventory: [
    {
      id: 'inv-001',
      name: 'San Marzano Tomaten',
      category: 'Zutaten',
      quantity: 15.5,
      unit: 'kg',
      minQuantity: 10,
      costPrice: 8.50,
      supplier: 'Italian Imports'
    },
    {
      id: 'inv-002',
      name: 'Parmigiano Reggiano',
      category: 'Zutaten',
      quantity: 3.2,
      unit: 'kg', 
      minQuantity: 2,
      costPrice: 35.00,
      supplier: 'Caseificio Romano'
    }
  ],
  purchases: [
    {
      id: 'pur-001',
      orderNumber: 'BV-2024-001',
      supplier: 'Italian Imports',
      orderDate: '2024-11-25',
      status: 'DELIVERED',
      totalAmount: 485.50
    }
  ],
  events: [
    {
      id: 'evt-001',
      title: 'Weinlieferung',
      startDate: '2024-12-15T10:00:00',
      type: 'DELIVERY',
      priority: 'MEDIUM'
    }
  ],
  stats: {
    dailyRevenue: 2485.00,
    orders: 127,
    appointments: 8,
    weeklyProfit: 15420.00
  }
};

// Zur Goldenen Gans (German Restaurant) - Restaurante Alemão
const zurGoldenenGansMockData: RestaurantMockData = {
  accounts: {
    payable: [
      {
        id: 'pay-003',
        description: 'Bierlieferung Augustiner',
        amount: 680.00,
        dueDate: '2024-12-10',
        status: 'PENDING',
        category: 'FOOD_SUPPLIES',
        vendor: 'Augustiner Bräu München'
      },
      {
        id: 'pay-004',
        description: 'Stromrechnung November',
        amount: 450.00,
        dueDate: '2024-12-05',
        status: 'OVERDUE',
        category: 'UTILITIES',
        vendor: 'Stadtwerke Berlin'
      }
    ],
    receivable: [
      {
        id: 'rec-002',
        description: 'Oktoberfest Event',
        amount: 2800.00,
        dueDate: '2024-12-18',
        status: 'PENDING',
        category: 'EVENTS',
        customer: 'Berliner Eventgesellschaft'
      }
    ]
  },
  inventory: [
    {
      id: 'inv-003',
      name: 'Schweineschulter',
      category: 'Fleisch',
      quantity: 25.0,
      unit: 'kg',
      minQuantity: 15,
      costPrice: 12.50,
      supplier: 'Fleischerei Müller'
    },
    {
      id: 'inv-004',
      name: 'Sauerkraut',
      category: 'Beilagen',
      quantity: 8.5,
      unit: 'kg',
      minQuantity: 5,
      costPrice: 3.20,
      supplier: 'Konservenfabrik Nord'
    }
  ],
  purchases: [
    {
      id: 'pur-002',
      orderNumber: 'GG-2024-002',
      supplier: 'Fleischerei Müller',
      orderDate: '2024-11-28',
      status: 'CONFIRMED',
      totalAmount: 750.00
    }
  ],
  events: [
    {
      id: 'evt-002',
      title: 'Bierlieferung',
      startDate: '2024-12-10T14:00:00',
      type: 'DELIVERY',
      priority: 'HIGH'
    }
  ],
  stats: {
    dailyRevenue: 1980.00,
    orders: 89,
    appointments: 5,
    weeklyProfit: 12750.00
  }
};

// Sakura Sushi (Japanese Restaurant) - Restaurante Japonês
const sakuraSushiMockData: RestaurantMockData = {
  accounts: {
    payable: [
      {
        id: 'pay-005',
        description: 'Frischer Thunfisch',
        amount: 1200.00,
        dueDate: '2024-12-08',
        status: 'PAID',
        category: 'FOOD_SUPPLIES',
        vendor: 'Tsukiji Fish Market Berlin'
      },
      {
        id: 'pay-006',
        description: 'Reinigungsservice',
        amount: 320.00,
        dueDate: '2024-12-12',
        status: 'PENDING',
        category: 'MAINTENANCE',
        vendor: 'Clean Master Services'
      }
    ],
    receivable: [
      {
        id: 'rec-003',
        description: 'Sushi Kurs Workshop',
        amount: 890.00,
        dueDate: '2024-12-25',
        status: 'PENDING',
        category: 'EVENTS',
        customer: 'Kochschule Berlin'
      }
    ]
  },
  inventory: [
    {
      id: 'inv-005',
      name: 'Sushi Reis',
      category: 'Grundzutaten',
      quantity: 45.0,
      unit: 'kg',
      minQuantity: 20,
      costPrice: 4.80,
      supplier: 'Asia Import'
    },
    {
      id: 'inv-006',
      name: 'Nori Blätter',
      category: 'Zutaten',
      quantity: 12.0,
      unit: 'Packungen',
      minQuantity: 8,
      costPrice: 15.00,
      supplier: 'Japan Food Trading'
    }
  ],
  purchases: [
    {
      id: 'pur-003',
      orderNumber: 'SS-2024-003',
      supplier: 'Tsukiji Fish Market Berlin',
      orderDate: '2024-11-30',
      status: 'DELIVERED',
      totalAmount: 1450.00
    }
  ],
  events: [
    {
      id: 'evt-003',
      title: 'Fisch Lieferung',
      startDate: '2024-12-08T08:00:00',
      type: 'DELIVERY',
      priority: 'URGENT'
    }
  ],
  stats: {
    dailyRevenue: 3120.00,
    orders: 156,
    appointments: 12,
    weeklyProfit: 18900.00
  }
};

// Export function to get restaurant-specific data
// Função para exportar dados específicos do restaurante
export const getRestaurantMockData = (restaurantId: string): RestaurantMockData | null => {
  switch (restaurantId) {
    case 'restaurant-001':
      return laBellaVistaMockData;
    case 'restaurant-002':
      return zurGoldenenGansMockData;
    case 'restaurant-003':
      return sakuraSushiMockData;
    default:
      return null;
  }
};

// Get stats for a specific restaurant
// Obter estatísticas para um restaurante específico
export const getRestaurantStats = (restaurantId: string) => {
  const data = getRestaurantMockData(restaurantId);
  return data ? data.stats : {
    dailyRevenue: 0,
    orders: 0,
    appointments: 0,
    weeklyProfit: 0
  };
};

// Get accounts for a specific restaurant
// Obter contas para um restaurante específico
export const getRestaurantAccounts = (restaurantId: string) => {
  const data = getRestaurantMockData(restaurantId);
  return data ? data.accounts : { payable: [], receivable: [] };
};

// Get inventory for a specific restaurant
// Obter inventário para um restaurante específico
export const getRestaurantInventory = (restaurantId: string) => {
  const data = getRestaurantMockData(restaurantId);
  return data ? data.inventory : [];
};

// Get purchases for a specific restaurant
// Obter compras para um restaurante específico
export const getRestaurantPurchases = (restaurantId: string) => {
  const data = getRestaurantMockData(restaurantId);
  return data ? data.purchases : [];
};

// Get events for a specific restaurant
// Obter eventos para um restaurante específico
export const getRestaurantEvents = (restaurantId: string) => {
  const data = getRestaurantMockData(restaurantId);
  return data ? data.events : [];
}; 