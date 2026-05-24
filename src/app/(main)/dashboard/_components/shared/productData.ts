/**
 * Single source of truth for product catalogue and order-item enrichment.
 * Used by both the Dashboard TopSellingProducts widget and the Sales Analytics page.
 *
 * Rules:
 *  - Only DELIVERED orders count as revenue.
 *  - Each order is deterministically split into 1–3 line items using the order ID as seed,
 *    so numbers are stable across re-renders and both pages always agree.
 */

// ─── Catalogue ────────────────────────────────────────────────────────────────
export interface CatalogueItem {
  id: string;
  name: string;
  category: string;
  brand: string;
  unitPrice: number;
}

export const CATALOGUE: CatalogueItem[] = [
  { id: "GK-001", name: "Milo Refill", category: "Baby & Kids", brand: "Nestlé", unitPrice: 2_500 },
  { id: "GK-002", name: "Peak Milk Tin", category: "Groceries", brand: "Peak", unitPrice: 1_800 },
  { id: "GK-003", name: "Golden Morn", category: "Baby & Kids", brand: "Nestlé", unitPrice: 1_200 },
  { id: "GK-004", name: "Indomie Noodles", category: "Groceries", brand: "Indomie", unitPrice: 6_500 },
  { id: "GK-005", name: "Nescafe Coffee", category: "Beverages", brand: "Nestlé", unitPrice: 3_200 },
  { id: "GK-006", name: "Sunlight Soap", category: "Household", brand: "Unilever", unitPrice: 800 },
  { id: "GK-007", name: "Lipton Tea", category: "Beverages", brand: "Unilever", unitPrice: 1_500 },
  { id: "GK-008", name: "Coke Can", category: "Beverages", brand: "Coca-Cola", unitPrice: 4_800 },
  { id: "GK-009", name: "Sprite Bottle", category: "Beverages", brand: "Coca-Cola", unitPrice: 5_200 },
  { id: "GK-010", name: "Cadbury Chocolate", category: "Groceries", brand: "Cadbury", unitPrice: 2_200 },
  { id: "GK-011", name: "Ovaltine", category: "Baby & Kids", brand: "Ovaltine", unitPrice: 2_800 },
  { id: "GK-012", name: "Maggi Cubes", category: "Groceries", brand: "Nestlé", unitPrice: 900 },
  { id: "GK-013", name: "Fanta Can", category: "Beverages", brand: "Coca-Cola", unitPrice: 4_500 },
  { id: "GK-014", name: "Lays Chips", category: "Groceries", brand: "Lays", unitPrice: 1_600 },
  { id: "GK-015", name: "Tropical Juice", category: "Beverages", brand: "Tropical", unitPrice: 2_100 },
  { id: "GK-016", name: "Nestle Pure Water", category: "Beverages", brand: "Nestlé", unitPrice: 800 },
  { id: "GK-017", name: "Pepsi Bottle", category: "Beverages", brand: "PepsiCo", unitPrice: 5_000 },
  { id: "GK-018", name: "Royal Gala Apple", category: "Groceries", brand: "Fresh Farm", unitPrice: 4_200 },
  { id: "GK-019", name: "Heineken Beer", category: "Beverages", brand: "Heineken", unitPrice: 9_800 },
  { id: "GK-020", name: "Nestle Yogurt", category: "Groceries", brand: "Nestlé", unitPrice: 1_400 },
  { id: "GK-021", name: "Chivita Juice", category: "Beverages", brand: "CHI Ltd", unitPrice: 2_400 },
  { id: "GK-022", name: "Sunflower Oil", category: "Household", brand: "Unilever", unitPrice: 3_800 },
  { id: "GK-023", name: "Pampers Diaper", category: "Baby & Kids", brand: "P&G", unitPrice: 8_500 },
  { id: "GK-024", name: "Sardine Tin", category: "Groceries", brand: "Titus", unitPrice: 1_100 },
  { id: "GK-025", name: "Eva Water", category: "Beverages", brand: "Eva", unitPrice: 900 },
  { id: "GK-026", name: "Tomato Paste", category: "Groceries", brand: "Gino", unitPrice: 1_300 },
  { id: "GK-027", name: "Amstel Malta", category: "Beverages", brand: "Heineken", unitPrice: 3_600 },
  { id: "GK-028", name: "Frytol Oil", category: "Household", brand: "Frytol", unitPrice: 4_100 },
  { id: "GK-029", name: "Kellogg Cornflakes", category: "Baby & Kids", brand: "Kellogg's", unitPrice: 2_900 },
  { id: "GK-030", name: "Cocoa Powder", category: "Groceries", brand: "Cadbury", unitPrice: 2_600 },
];

// ─── Types ────────────────────────────────────────────────────────────────────
export interface OrderLineItem {
  productId: string;
  name: string;
  category: string;
  brand: string;
  unitPrice: number;
  qty: number;
  amount: number;
}

export interface EnrichedOrderItem extends OrderLineItem {
  orderId: string;
  customer: string;
  region: string;
  createdAt: Date;
}

export interface ProductRow {
  productId: string;
  name: string;
  category: string;
  brand: string;
  revenue: number;
  units: number;
}

// ─── Order → line items ───────────────────────────────────────────────────────
// Deterministically splits one order into 1–3 product line items.
// The order ID seed guarantees the same split every time, so both
// the Dashboard and Sales Analytics always show identical numbers.
export function getOrderItems(orderId: string, totalAmount: number): OrderLineItem[] {
  const seed = parseInt(orderId.replace(/\D/g, ""), 10) || 1;
  const count = 1 + (seed % 3); // 1–3 products per order

  const used = new Set<number>();
  const picks: CatalogueItem[] = [];
  for (let i = 0; i < count; i++) {
    let idx = (seed * 7 + i * 13) % CATALOGUE.length;
    while (used.has(idx)) idx = (idx + 1) % CATALOGUE.length;
    used.add(idx);
    picks.push(CATALOGUE[idx]);
  }

  // Distribute revenue proportionally by unit price weight.
  // Last item absorbs rounding remainder so items always sum to totalAmount.
  const totalWeight = picks.reduce((s, p) => s + p.unitPrice, 0);
  const items: OrderLineItem[] = [];
  let usedAmount = 0;

  picks.forEach((p, i) => {
    if (i === picks.length - 1) {
      const amount = totalAmount - usedAmount;
      items.push({
        productId: p.id,
        name: p.name,
        category: p.category,
        brand: p.brand,
        unitPrice: p.unitPrice,
        qty: Math.max(1, Math.round(amount / p.unitPrice)),
        amount,
      });
    } else {
      const amount = Math.round((p.unitPrice / totalWeight) * totalAmount);
      usedAmount += amount;
      items.push({
        productId: p.id,
        name: p.name,
        category: p.category,
        brand: p.brand,
        unitPrice: p.unitPrice,
        qty: Math.max(1, Math.round(amount / p.unitPrice)),
        amount,
      });
    }
  });

  return items;
}

// ─── Aggregator ───────────────────────────────────────────────────────────────
// Returns top products sorted by revenue for a set of delivered orders.
export function aggregateTopProducts(
  orders: { id: string; amount: number; status: string; createdAt: Date }[],
  start: Date,
  end: Date,
): ProductRow[] {
  const map = new Map<string, ProductRow>();

  orders
    .filter((o) => o.status === "Delivered" && o.createdAt >= start && o.createdAt <= end)
    .forEach((o) => {
      getOrderItems(o.id, o.amount).forEach((item) => {
        const row = map.get(item.productId) ?? {
          productId: item.productId,
          name: item.name,
          category: item.category,
          brand: item.brand,
          revenue: 0,
          units: 0,
        };
        row.revenue += item.amount;
        row.units += item.qty;
        map.set(item.productId, row);
      });
    });

  return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
}
