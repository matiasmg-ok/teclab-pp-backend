import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { DefaultData } from "./DefaultData";
import { Order } from "./Order";
import { Product } from "./Product";

@Entity('order_products')
export class OrderProduct extends DefaultData {
  @ManyToOne(() => Order, order => order.products, { nullable: false })
  @JoinColumn()
  order: Order;

  @OneToOne(() => Product, { nullable: false })
  @JoinColumn()
  product: Product;
}