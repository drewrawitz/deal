import {
  Index,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { Game } from "./Game";
import { User } from "./User";

@Entity()
export class GameEvents {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  game_id: number;

  @ManyToOne(() => Game, (game) => game.events)
  @JoinColumn({ name: "game_id" })
  game: Game;

  @Index()
  @Column({ nullable: true })
  player_id: string | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: "player_id" })
  player: User;

  @Column({ type: "smallint" })
  sequence: number;

  @Column()
  event_type: string;

  @Column({ type: "jsonb", nullable: true })
  data: Record<string, unknown>;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;
}
