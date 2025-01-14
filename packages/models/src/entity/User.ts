import { Entity, Column, BeforeInsert, OneToMany } from "typeorm";
import { generateEntityId } from "../utils";
import { SoftDeletableEntity } from "../interfaces/soft-deletable.entity";
import { GamePlayers } from "./GamePlayers";
import { Game } from "./Game";
import { Message } from "./Message";

@Entity()
export class User extends SoftDeletableEntity {
  @Column()
  username: string;

  @Column({ nullable: true })
  avatar: string;

  @OneToMany(() => GamePlayers, (players) => players.player, {
    cascade: ["remove"],
  })
  games: GamePlayers[];

  @OneToMany(() => Game, (game) => game.owner)
  owned_games: Game[];

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "user");
  }
}
