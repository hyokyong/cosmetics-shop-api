export class CreateOrderDto {
  items!: {
    productId: number;
    quantity: number;
    price: number;
  }[];
}
