import { Column, PrimaryGeneratedColumn } from "typeorm";

export class DefaultData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP()' })
  createdAt: Date;

  @Column('datetime',  { nullable: true, default: undefined, onUpdate: 'CURRENT_TIMESTAMP()' })
  updatedAt?: Date;

  @Column('datetime', { nullable: true, default: undefined })
  deletedAt?: Date;
}