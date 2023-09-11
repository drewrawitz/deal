import { MigrationInterface, QueryRunner } from "typeorm";

export class Chat1694403644799 implements MigrationInterface {
    name = 'Chat1694403644799'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_07f23fc9996f08ac23518249a00"`);
        await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "game_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_07f23fc9996f08ac23518249a00" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_07f23fc9996f08ac23518249a00"`);
        await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "game_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_07f23fc9996f08ac23518249a00" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
