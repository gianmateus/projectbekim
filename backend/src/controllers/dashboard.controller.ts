import { Request, Response } from 'express';
import { getRestaurantStats, getRestaurantAccounts, getRestaurantInventory, getRestaurantPurchases, getRestaurantEvents } from '../utils/mockData';
import { validateRestaurantAccess } from '../utils/restaurants';

// Interface for authenticated request - Interface para requisição autenticada
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

// Get dashboard stats for a specific restaurant
// Obter estatísticas do dashboard para um restaurante específico
export const getDashboardStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      console.log('❌ User not authenticated');
      res.status(401).json({ 
        success: false, 
        message: 'Benutzer nicht authentifiziert' 
      });
      return;
    }

    const { restaurantId } = req.params;
    console.log('🔍 Dashboard Stats Request:', { 
      userId: req.user.id, 
      restaurantId,
      userEmail: req.user.email 
    });

    // Validate restaurant access
    // Validar acesso ao restaurante
    if (!validateRestaurantAccess(restaurantId, req.user.id)) {
      console.log('❌ Access denied to restaurant:', { 
        userId: req.user.id, 
        restaurantId 
      });
      res.status(403).json({ 
        success: false, 
        message: 'Kein Zugriff auf dieses Restaurant' 
      });
      return;
    }

    const stats = getRestaurantStats(restaurantId);
    console.log('✅ Returning stats for restaurant:', restaurantId);

    res.json({
      success: true,
      data: stats,
      message: 'Dashboard-Statistiken erfolgreich abgerufen'
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Fehler beim Abrufen der Dashboard-Statistiken' 
    });
  }
};

// Get complete dashboard data for a restaurant
// Obter dados completos do dashboard para um restaurante
export const getDashboardData = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      console.log('❌ User not authenticated for dashboard data');
      res.status(401).json({ 
        success: false, 
        message: 'Benutzer nicht authentifiziert' 
      });
      return;
    }

    const { restaurantId } = req.params;
    console.log('🔍 Dashboard Data Request:', { 
      userId: req.user.id, 
      restaurantId,
      userEmail: req.user.email 
    });

    // Validate restaurant access
    // Validar acesso ao restaurante
    if (!validateRestaurantAccess(restaurantId, req.user.id)) {
      console.log('❌ Access denied to restaurant for dashboard data:', { 
        userId: req.user.id, 
        restaurantId 
      });
      res.status(403).json({ 
        success: false, 
        message: 'Kein Zugriff auf dieses Restaurant' 
      });
      return;
    }

    console.log('✅ Access granted, fetching data for restaurant:', restaurantId);

    // Get all data for the restaurant
    // Obter todos os dados para o restaurante
    const stats = getRestaurantStats(restaurantId);
    const accounts = getRestaurantAccounts(restaurantId);
    const inventory = getRestaurantInventory(restaurantId);
    const purchases = getRestaurantPurchases(restaurantId);
    const events = getRestaurantEvents(restaurantId);

    console.log('📊 Data fetched successfully:', { 
      restaurantId, 
      hasStats: !!stats,
      accountsCount: accounts.payable.length + accounts.receivable.length,
      inventoryCount: inventory.length 
    });

    // Calculate additional metrics
    // Calcular métricas adicionais
    const pendingPayables = accounts.payable.filter(p => p.status === 'PENDING').length;
    const overduePayables = accounts.payable.filter(p => p.status === 'OVERDUE').length;
    const pendingReceivables = accounts.receivable.filter(r => r.status === 'PENDING').length;
    const lowStockItems = inventory.filter(i => i.quantity <= i.minQuantity).length;
    const pendingPurchases = purchases.filter(p => p.status === 'PENDING' || p.status === 'CONFIRMED').length;
    const upcomingEvents = events.filter(e => new Date(e.startDate) >= new Date()).length;

    const dashboardData = {
      stats,
      summary: {
        pendingPayables,
        overduePayables,
        pendingReceivables,
        lowStockItems,
        pendingPurchases,
        upcomingEvents
      },
      accounts: {
        payable: accounts.payable.slice(0, 5), // Latest 5
        receivable: accounts.receivable.slice(0, 5) // Latest 5
      },
      inventory: inventory.slice(0, 8), // Top 8 items
      purchases: purchases.slice(0, 5), // Latest 5
      events: events.slice(0, 5) // Next 5 events
    };

    res.json({
      success: true,
      data: dashboardData,
      message: 'Dashboard-Daten erfolgreich abgerufen'
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Fehler beim Abrufen der Dashboard-Daten' 
    });
  }
};

// Get accounts for a specific restaurant
// Obter contas para um restaurante específico
export const getAccounts = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ 
        success: false, 
        message: 'Benutzer nicht authentifiziert' 
      });
      return;
    }

    const { restaurantId } = req.params;

    // Validate restaurant access
    // Validar acesso ao restaurante
    if (!validateRestaurantAccess(restaurantId, req.user.id)) {
      res.status(403).json({ 
        success: false, 
        message: 'Kein Zugriff auf dieses Restaurant' 
      });
      return;
    }

    const accounts = getRestaurantAccounts(restaurantId);

    res.json({
      success: true,
      data: accounts,
      message: 'Konten erfolgreich abgerufen'
    });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Fehler beim Abrufen der Konten' 
    });
  }
};

// Get inventory for a specific restaurant
// Obter inventário para um restaurante específico
export const getInventory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ 
        success: false, 
        message: 'Benutzer nicht authentifiziert' 
      });
      return;
    }

    const { restaurantId } = req.params;

    // Validate restaurant access
    // Validar acesso ao restaurante
    if (!validateRestaurantAccess(restaurantId, req.user.id)) {
      res.status(403).json({ 
        success: false, 
        message: 'Kein Zugriff auf dieses Restaurant' 
      });
      return;
    }

    const inventory = getRestaurantInventory(restaurantId);

    res.json({
      success: true,
      data: inventory,
      message: 'Inventar erfolgreich abgerufen'
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Fehler beim Abrufen des Inventars' 
    });
  }
}; 