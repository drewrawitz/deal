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
export class GamePlayers {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  game_id: number;

  @ManyToOne(() => Game, (game) => game.players, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "game_id" })
  game: Game;

  @Index()
  @Column()
  player_id: string;

  @ManyToOne(() => User, (user) => user.games)
  @JoinColumn({ name: "player_id" })
  player: User;

  @Column({ type: "smallint" })
  position: number;

  @CreateDateColumn({ type: "timestamptz" })
  joined_at: Date;
}
