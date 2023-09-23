import { MigrationInterface, QueryRunner } from "typeorm";

export class Cascade1695439980026 implements MigrationInterface {
    name = 'Cascade1695439980026'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game_events" DROP CONSTRAINT "FK_5e9c9173e6d21d06023146b42e3"`);
        await queryRunner.query(`ALTER TABLE "game_events" ADD CONSTRAINT "FK_5e9c9173e6d21d06023146b42e3" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game_events" DROP CONSTRAINT "FK_5e9c9173e6d21d06023146b42e3"`);
        await queryRunner.query(`ALTER TABLE "game_events" ADD CONSTRAINT "FK_5e9c9173e6d21d06023146b42e3" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
