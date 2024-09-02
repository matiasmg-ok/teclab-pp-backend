import { Column, Entity } from "typeorm";
import { DefaultData } from "./DefaultData";

@Entity("advertisements")
export class Advertisement extends DefaultData {
  @Column("varchar", { length: 100 })
  title: string;

  @Column("text")
  redirectUrl: string;

  @Column("text")
  imageUrl: string;
}