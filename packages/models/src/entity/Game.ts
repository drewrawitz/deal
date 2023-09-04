import {
  Index,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import { GamePlayers } from "./GamePlayers";
import { GameEvents } from "./GameEvents";

export enum GameStatus {
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
    cascade: true,
  })
  players: GamePlayers[];

  @OneToMany(() => GameEvents, (events) => events.game, {
    cascade: ["remove"],
  })
  events: GameEvents[];

  @Column({ type: "timestamptz", nullable: true })
  started_at: Date | null;

  @Column({ type: "timestamptz", nullable: true })
  finished_at: Date | null;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;
}
