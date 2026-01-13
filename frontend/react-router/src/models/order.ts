export type OrderItem = {
  id: number;
  product_id: number;
  unit_price_cents: number;
  quantity: number;
};

export type Order = {
  id: number;
  status: string;
  total_cents: number;
  currency: string;
  created_at: string;
  items: OrderItem[];
};
