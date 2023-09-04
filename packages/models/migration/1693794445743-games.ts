import { MigrationInterface, QueryRunner } from "typeorm";

export class Games1693794445743 implements MigrationInterface {
    name = 'Games1693794445743'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."game_status_enum" AS ENUM('waiting', 'in_progress', 'abandoned', 'finished')`);
        await queryRunner.query(`CREATE TABLE "game" ("id" SERIAL NOT NULL, "status" "public"."game_status_enum" NOT NULL DEFAULT 'waiting', "started_at" TIMESTAMP WITH TIME ZONE, "finished_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1f2f5fed6227e9266b8e6f4040" ON "game" ("status") `);
        await queryRunner.query(`CREATE TABLE "game_players" ("id" SERIAL NOT NULL, "game_id" integer NOT NULL, "user_id" character varying NOT NULL, "position" smallint NOT NULL, CONSTRAINT "PK_a99af25a1c97122f04ba778197c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_67b26bf4c76bd09a206d504824" ON "game_players" ("game_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_b9adcb616544097a980720bbcc" ON "game_players" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "game_players" ADD CONSTRAINT "FK_67b26bf4c76bd09a206d504824b" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game_players" ADD CONSTRAINT "FK_b9adcb616544097a980720bbcc6" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game_players" DROP CONSTRAINT "FK_b9adcb616544097a980720bbcc6"`);
        await queryRunner.query(`ALTER TABLE "game_players" DROP CONSTRAINT "FK_67b26bf4c76bd09a206d504824b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b9adcb616544097a980720bbcc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_67b26bf4c76bd09a206d504824"`);
        await queryRunner.query(`DROP TABLE "game_players"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1f2f5fed6227e9266b8e6f4040"`);
        await queryRunner.query(`DROP TABLE "game"`);
        await queryRunner.query(`DROP TYPE "public"."game_status_enum"`);
    }

}
