import { Entity, Column, BeforeInsert } from "typeorm";
import { generateEntityId } from "@deal/utils-client";
import { SoftDeletableEntity } from "../interfaces/soft-deletable.entity";

@Entity()
export class User extends SoftDeletableEntity {
  @Column()
  username: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "user");
  }
}
