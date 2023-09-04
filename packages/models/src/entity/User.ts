import { Entity, Column, BeforeInsert, OneToMany } from "typeorm";
import { generateEntityId } from "@deal/utils-client";
import { SoftDeletableEntity } from "../interfaces/soft-deletable.entity";
import { GamePlayers } from "./GamePlayers";

@Entity()
export class User extends SoftDeletableEntity {
  @Column()
  username: string;

  @Column({ nullable: true })
  avatar: string;

  @OneToMany(() => GamePlayers, (players) => players.user)
  games: GamePlayers[];

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "user");
  }
}
