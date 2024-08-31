import { Column, Entity, ManyToOne, OneToOne } from "typeorm";
import { DefaultData } from "./DefaultData";
import { Order } from "./Order";
import { Product } from "./Product";

@Entity('order_products')
export class OrderProduct extends DefaultData {
  @ManyToOne(() => Order, order => order.products)
  order: Order;

  @OneToOne(() => Product)
  product: Product;

  @Column("int")
  quantity: number;
}