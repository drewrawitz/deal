import { MigrationInterface, QueryRunner } from "typeorm";

export class GameOwner1694282571368 implements MigrationInterface {
    name = 'GameOwner1694282571368'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_678fcc30dbaf1c4c7e86bc10d16"`);
        await queryRunner.query(`ALTER TABLE "game" ALTER COLUMN "owner_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_678fcc30dbaf1c4c7e86bc10d16" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_678fcc30dbaf1c4c7e86bc10d16"`);
        await queryRunner.query(`ALTER TABLE "game" ALTER COLUMN "owner_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_678fcc30dbaf1c4c7e86bc10d16" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
