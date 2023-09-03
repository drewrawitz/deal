import { Index, Entity, Column, PrimaryGeneratedColumn } from "typeorm";

enum CardType {
  ACTION = "action",
  PROPERTY = "property",
  MONEY = "money",
  RENT = "rent",
  WILDCARD = "wildcard",
}

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column("varchar", { length: 255 })
  slug: string;

  @Column("varchar", { length: 255, nullable: true })
  name: string | null;

  @Column("text", { nullable: true })
  description: string | null;

  @Column({
    type: "enum",
    enum: CardType,
    default: CardType.ACTION,
  })
  type: CardType;

  @Column({ type: "smallint", default: 0 })
  value: number;

  @Column({ type: "smallint", default: 1 })
  deck_quantity: number;

  @Column("text", { nullable: true })
  photo: string | null;
}
