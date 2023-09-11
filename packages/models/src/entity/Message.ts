import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Game } from "./Game";

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  content: string;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @DeleteDateColumn({ type: "timestamptz" })
  deleted_at: Date | null;

  @ManyToOne(() => User, (user) => user.messages, {
    onDelete: "CASCADE",
    nullable: false,
  })
  user: User;

  @ManyToOne(() => Game, (game) => game.messages, {
    onDelete: "CASCADE",
    nullable: true,
  })
  game?: Game | null;
}
