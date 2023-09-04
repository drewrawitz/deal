import {
  Index,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import { GamePlayers } from "./GamePlayers";

enum GameStatus {
  WAITING = "waiting",
  IN_PROGRESS = "in_progress",
  ABANDONDED = "abandoned",
  FINISHED = "finished",
}

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({
    type: "enum",
    enum: GameStatus,
    default: GameStatus.WAITING,
  })
  status: GameStatus;

  @OneToMany(() => GamePlayers, (players) => players.game, {
    cascade: ["remove"],
  })
  players: GamePlayers[];

  @Column({ type: "timestamptz", nullable: true })
  started_at: Date | null;

  @Column({ type: "timestamptz", nullable: true })
  finished_at: Date | null;
}
