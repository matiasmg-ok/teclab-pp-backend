import { Column, Entity, OneToMany } from "typeorm";
import { DefaultData } from "./DefaultData";
import { ProductImage } from "./ProductImage";

@Entity("products")
export class Product extends DefaultData {
  @Column("varchar", { length: 150 })
  name: string;

  @Column("text")
  description: string;

  @Column("varchar", { length: 100 })
  group: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column("varchar", { length: 255, nullable: true })
  imageUrl?: string;

  @OneToMany(() => ProductImage, image => image.product, { onDelete: 'CASCADE' })
  images: ProductImage[]
}