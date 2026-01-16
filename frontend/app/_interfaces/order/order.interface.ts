export interface IOrder {
    id: number;
    date: Date;
    productTotal: number;
    total: number;
    shippingCharge: number;
    cancelledBy: string | null;
    cancelledAt: Date | null;
    deliveredAt: Date | null;
}
