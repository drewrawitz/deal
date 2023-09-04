import { Entity, Column, BeforeInsert, OneToMany } from "typeorm";
import { generateEntityId } from "@deal/utils-client";
import { SoftDeletableEntity } from "../interfaces/soft-deletable.entity";
import { GamePlayers } from "./GamePlayers";
import { GameEvents } from "./GameEvents";

@Entity()
export class User extends SoftDeletableEntity {
  @Column()
  username: string;

  @Column({ nullable: true })
  avatar: string;

  @OneToMany(() => GamePlayers, (players) => players.player)
  games: GamePlayers[];

  @OneToMany(() => GamePlayers, (players) => players.player)
  game_events: GameEvents[];

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "user");
  }
}
