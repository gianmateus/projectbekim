// Shared types for Restaurant Financial Management System
// Tipos compartilhados para o Sistema de Gestão Financeira de Restaurante

// User types - Tipos de usuário
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE'
}

// Account types - Tipos de conta
export interface AccountPayable {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: AccountStatus;
  category: PayableCategory;
  supplier?: string;
  invoiceNumber?: string;
  notes?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccountReceivable {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  receivedDate?: string;
  status: AccountStatus;
  category: ReceivableCategory;
  customer?: string;
  invoiceNumber?: string;
  notes?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export enum AccountStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED'
}

export enum PayableCategory {
  INGREDIENTS = 'INGREDIENTS',
  UTILITIES = 'UTILITIES',
  RENT = 'RENT',
  SALARIES = 'SALARIES',
  EQUIPMENT = 'EQUIPMENT',
  MAINTENANCE = 'MAINTENANCE',
  MARKETING = 'MARKETING',
  TAXES = 'TAXES',
  OTHER = 'OTHER'
}

export enum ReceivableCategory {
  FOOD_SALES = 'FOOD_SALES',
  BEVERAGE_SALES = 'BEVERAGE_SALES',
  DELIVERY = 'DELIVERY',
  CATERING = 'CATERING',
  OTHER = 'OTHER'
}

// Inventory types - Tipos de inventário
export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  currentStock: number;
  minStock: number;
  maxStock?: number;
  unit: StockUnit;
  pricePerUnit: number;
  category: ItemCategory;
  supplier?: string;
  barcode?: string;
  expiryDate?: string;
  isActive: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export enum StockUnit {
  KG = 'KG',
  G = 'G',
  L = 'L',
  ML = 'ML',
  UNITS = 'UNITS',
  DOZENS = 'DOZENS'
}

export enum ItemCategory {
  VEGETABLES = 'VEGETABLES',
  MEAT = 'MEAT',
  DAIRY = 'DAIRY',
  GRAINS = 'GRAINS',
  SPICES = 'SPICES',
  BEVERAGES = 'BEVERAGES',
  CLEANING = 'CLEANING',
  PACKAGING = 'PACKAGING',
  OTHER = 'OTHER'
}

// Purchase types - Tipos de compra
export interface Purchase {
  id: string;
  purchaseDate: string;
  supplier: string;
  totalAmount: number;
  status: PurchaseStatus;
  deliveryDate?: string;
  invoiceNumber?: string;
  notes?: string;
  userId: string;
  items: PurchaseItem[];
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseItem {
  id: string;
  purchaseId: string;
  inventoryItemId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  inventoryItem: InventoryItem;
  createdAt: string;
}

export enum PurchaseStatus {
  PENDING = 'PENDING',
  ORDERED = 'ORDERED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

// Calendar types - Tipos de calendário
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  eventType: EventType;
  isAllDay: boolean;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export enum EventType {
  PAYMENT_DUE = 'PAYMENT_DUE',
  DELIVERY = 'DELIVERY',
  MAINTENANCE = 'MAINTENANCE',
  MEETING = 'MEETING',
  HOLIDAY = 'HOLIDAY',
  PROMOTION = 'PROMOTION',
  OTHER = 'OTHER'
}

// API Response types - Tipos de resposta da API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form types - Tipos de formulário
export interface LoginForm {
  email: string;
  password: string;
}

export interface CreateAccountPayableForm {
  description: string;
  amount: number;
  dueDate: string;
  category: PayableCategory;
  supplier?: string;
  invoiceNumber?: string;
  notes?: string;
}

export interface CreateAccountReceivableForm {
  description: string;
  amount: number;
  dueDate: string;
  category: ReceivableCategory;
  customer?: string;
  invoiceNumber?: string;
  notes?: string;
}

export interface CreateInventoryItemForm {
  name: string;
  description?: string;
  currentStock: number;
  minStock: number;
  maxStock?: number;
  unit: StockUnit;
  pricePerUnit: number;
  category: ItemCategory;
  supplier?: string;
  barcode?: string;
  expiryDate?: string;
}

export interface CreatePurchaseForm {
  supplier: string;
  deliveryDate?: string;
  invoiceNumber?: string;
  notes?: string;
  items: {
    inventoryItemId: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export interface CreateCalendarEventForm {
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  eventType: EventType;
  isAllDay: boolean;
  color?: string;
}

// Dashboard types - Tipos do dashboard
export interface DashboardStats {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  pendingPayables: number;
  pendingReceivables: number;
  lowStockItems: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}

// Restaurant types - Tipos de restaurante
export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  address: string;
  phone?: string;
  email?: string;
  logo?: string;
  color?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRestaurantDto {
  name: string;
  description?: string;
  address: string;
  phone?: string;
  email?: string;
  logo?: string;
  color?: string;
}

export interface UpdateRestaurantDto extends Partial<CreateRestaurantDto> {} 