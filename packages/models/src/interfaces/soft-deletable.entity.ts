import { BaseEntity } from "./base.entity";
import { DeleteDateColumn } from "typeorm";

export abstract class SoftDeletableEntity extends BaseEntity {
  @DeleteDateColumn({ type: "timestamptz" })
  deleted_at: Date | null;
}
