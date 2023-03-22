export class OrderEntity {
  orderId: string;
  items: Items[];
}

export class Items {
  product: string;
  quantity: number;
}
