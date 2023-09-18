import { MigrationInterface, QueryRunner } from "typeorm";

export class Cascade1694993200552 implements MigrationInterface {
    name = 'Cascade1694993200552'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game_players" DROP CONSTRAINT "FK_67b26bf4c76bd09a206d504824b"`);
        await queryRunner.query(`ALTER TABLE "game_players" ADD CONSTRAINT "FK_67b26bf4c76bd09a206d504824b" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game_players" DROP CONSTRAINT "FK_67b26bf4c76bd09a206d504824b"`);
        await queryRunner.query(`ALTER TABLE "game_players" ADD CONSTRAINT "FK_67b26bf4c76bd09a206d504824b" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
