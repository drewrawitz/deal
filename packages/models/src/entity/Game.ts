import {
  Index,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { GamePlayers } from "./GamePlayers";
import { GameEvents } from "./GameEvents";
import { User } from "./User";
import { Message } from "./Message";

// This has to be duplicated to avoid a cyclic dependency
// This also lives in `@deal/types`.
// Make sure these are in sync.
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

  @ManyToOne(() => User, (user) => user.owned_games, {
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "owner_id" })
  owner: User;

  @Column()
  owner_id: string;

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

  @OneToMany(() => Message, (message) => message.game)
  messages: Message[];

  @Column({ type: "timestamptz", nullable: true })
  started_at: Date | null;

  @Column({ type: "timestamptz", nullable: true })
  finished_at: Date | null;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;
}
