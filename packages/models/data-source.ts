import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: "postgresql://postgres:@localhost:5432/deal?schema=public",
  synchronize: false,
  logging: true,
  entities: ["src/entity/**/*{.ts,.js}"],
  migrations: ["migration/**/*{.ts,.js}"],
  subscribers: [],
});
