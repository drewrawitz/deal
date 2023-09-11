import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
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

  @Index()
  @Column()
  user_id: string;

  @Index()
  @Column({ nullable: true })
  game_id: number | null;

  @ManyToOne(() => User, (user) => user.messages, {
    onDelete: "CASCADE",
    nullable: false,
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Game, (game) => game.messages, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "game_id" })
  game?: Game | null;
}
