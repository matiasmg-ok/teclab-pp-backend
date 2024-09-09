import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DefaultData } from "./DefaultData";
import { Order } from "./Order";

@Entity('users')
export class User extends DefaultData {
  @Column("text")
  name: string;

  @Column("text")
  email: string;

  @Column("text")
  password: string;

  @Column("varchar", { nullable: true, default: 'client' })
  profile: 'admin' | 'client'

  @OneToMany(() => Order, order => order.user)
  orders: Order[]
}