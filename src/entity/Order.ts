import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { DefaultData } from "./DefaultData";
import { User } from "./User";
import { OrderProduct } from "./OrderProduct";

@Entity("orders")
export class Order extends DefaultData {
  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @Column("varchar", { length: 100, default: 'payment-pending' })
  status: 'payment-pending' | 'payment-completed' | 'in-progress' | 'shipping' | 'finished' | 'cancelled';

  @Column("text")
  shippingAddress: string;

  @Column("text")
  trackingCode: string;

  @Column("text")
  additionalNotes: string;

  @Column("varchar", { length: 150 })
  city: string;

  @Column("varchar", { length: 150 })
  province: string;

  @Column("varchar", { length: 150 })
  zip: string;

  @Column('decimal', { precision: 50, scale: 2 })
  price: number;

  @Column('varchar', { length: 50 })
  currency: 'usd' | 'ars';

  @OneToMany(() => OrderProduct, orderProduct => orderProduct.order, { cascade: true })
  products: OrderProduct[]
}