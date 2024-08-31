import { Column, Entity, ManyToOne } from "typeorm";
import { DefaultData } from "./DefaultData";
import { Product } from "./Product";

@Entity("product_images")
export class ProductImage extends DefaultData {
  @ManyToOne(() => Product, product => product.images)
  product: Product;

  @Column("varchar", { length: 255 })
  imageUrl: string;
}