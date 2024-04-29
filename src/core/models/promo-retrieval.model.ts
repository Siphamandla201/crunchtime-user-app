export class PromoRetrievalModel {
    public id!: number;
    public activated!: boolean;
    public promoCode!: string;
    public limitingPrice!: number;
    public expiryDate!: string;
    public promoType!: string;
    public userId!: number;
    public userIds!: string;
    public orderId!: number;
    public deliveryId!: number;
    public itemId!: number;
    public categoryId!: number;
    public establishmentId!: number;
    public discountAmount!: number;
    public discountPercentage!: number;
}