import { CreateDateColumn, PrimaryColumn, UpdateDateColumn } from "typeorm";

/**
 * Base abstract entity for all entities
 */
export abstract class BaseEntity {
  @PrimaryColumn()
  id: string;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date;
}
