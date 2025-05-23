export interface InventoryItem {
  id?: string;
  name: string;
  category: string;
  stock: number;
  reorderLevel: number;
  unitPrice: number; // ✅ Add this line
  createdAt: any;
  userId: string;
}
