import { MigrationInterface, QueryRunner } from "typeorm";

export class Game1693801671505 implements MigrationInterface {
    name = 'Game1693801671505'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "game_players" ADD "joined_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game_players" DROP COLUMN "joined_at"`);
        await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "created_at"`);
    }

}
