// models/inventory.models.ts
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  reorderLevel: number;
  unitPrice: number;
  createdAt?: any;
  userId?: string;

  // Prediction Fields
  avgDailyConsumption?: number;
  daysUntilStockout?: number;
}
