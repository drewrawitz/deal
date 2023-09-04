import {
  Index,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
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

  @ManyToOne(() => Game, (game) => game.players)
  @JoinColumn({ name: "game_id" })
  game: Game;

  @Index()
  @Column()
  user_id: number;

  @ManyToOne(() => User, (user) => user.games)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "smallint" })
  position: number;
}
