/**
 * Orders Type Definitions
 * All types related to tables, orders, payments, and order items
 */

// ============================================================
// TABLE TYPES
// ============================================================

export type TableStatus = "available" | "occupied" | "reserved";

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  currentOrderId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// ORDER ITEM TYPES
// ============================================================

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  notes?: string;
}

// ============================================================
// PAYMENT TYPES
// ============================================================

export type PaymentMethod = "cash" | "credit" | "debit" | "pix";

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: "Dinheiro",
  credit: "Cartão de Crédito",
  debit: "Cartão de Débito",
  pix: "PIX",
};

export interface Payment {
  id: string;
  amount: number;
  method: PaymentMethod;
  paidAt: Date;
}

// ============================================================
// ORDER TYPES
// ============================================================

export type OrderStatus = "pending" | "preparing" | "ready" | "delivered" | "paid" | "cancelled";

export interface Order {
  id: string;
  tableId: string;
  tableNumber: number;
  items: OrderItem[];
  subtotal: number;
  serviceCharge: number; // 10% service fee
  total: number;
  status: OrderStatus;
  payments: Payment[];
  totalPaid: number;
  remainingBalance: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
}

export interface OrderFormData {
  tableId: string;
  items: OrderItem[];
  notes?: string;
}

export interface OrderWithTable extends Order {
  tableName: string;
}

// ============================================================
// PAYMENT FORM TYPES
// ============================================================

export interface PaymentFormData {
  orderId: string;
  amount: number;
  method: PaymentMethod;
}

// ============================================================
// ORDER CALCULATIONS
// ============================================================

export interface OrderCalculations {
  subtotal: number;
  serviceCharge: number;
  total: number;
  totalPaid: number;
  remainingBalance: number;
}

/**
 * Calculate order totals including service charge
 * @param items - Array of order items
 * @param payments - Array of payments made
 * @returns Calculated totals
 */
export function calculateOrderTotals(
  items: OrderItem[],
  payments: Payment[] = []
): OrderCalculations {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const serviceCharge = subtotal * 0.1; // 10% service charge
  const total = subtotal + serviceCharge;
  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const remainingBalance = total - totalPaid;

  return {
    subtotal,
    serviceCharge,
    total,
    totalPaid,
    remainingBalance,
  };
}

/**
 * Calculate item subtotal
 * @param quantity - Number of items
 * @param unitPrice - Price per unit
 * @returns Subtotal
 */
export function calculateItemSubtotal(quantity: number, unitPrice: number): number {
  return quantity * unitPrice;
}
