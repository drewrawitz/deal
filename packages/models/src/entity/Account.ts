import * as bcrypt from "bcryptjs";
import {
  OneToOne,
  JoinColumn,
  Entity,
  Index,
  Column,
  BeforeInsert,
} from "typeorm";
import { generateEntityId } from "@deal/utils-client";
import { SoftDeletableEntity } from "../interfaces/soft-deletable.entity";

@Entity()
export class User extends SoftDeletableEntity {
  @Index({ unique: true, where: "deleted_at IS NULL" })
  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Index()
  @Column({ nullable: true })
  user_id: string | null;

  @OneToOne(() => User, { cascade: ["insert"] })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "acct");
  }

  @BeforeInsert()
  async setPassword(password: string) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(password || this.password, salt);
  }
}
