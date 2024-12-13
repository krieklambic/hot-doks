export type HotdogType = 'CLASSIC' | 'ALSACE' | 'NEWYORK';
export type OrderStatus = 'ORDERED' | 'IN_PREPARATION' | 'READY';
export type PaymentType = 'CASH' | 'CARD';

export interface Hotdog {
  type: HotdogType;
  withKetchup: boolean;
  withMustard: boolean;
  withMayo: boolean;
  withOnions: boolean;
  comment: string | null;
  price: number;
}

export interface ApiOrder {
  id: number;
  orderStatus: OrderStatus;
  orderedBy: string | null;
  preparedBy: string | null;
  orderTime: string;
  preparationTime: string | null;
  customerName: string | null;
  paymentType: PaymentType | null;
  hotdogs: Hotdog[];
  preparationMinutes: number | null;
  totalPrice: number;
}

export interface OrderView {
  id: string;
  time: string;
  orderTime: string;
  orderedBy: string;
  preparedBy: string;
  classic: number;
  alsace: number;
  newYork: number;
  total: number;
  status: OrderStatus;
  customerName: string;
  paymentType: PaymentType;
  preparationMinutes: number;
  totalPrice: number;
}
