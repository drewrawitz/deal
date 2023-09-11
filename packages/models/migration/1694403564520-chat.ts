import { MigrationInterface, QueryRunner } from "typeorm";

export class Chat1694403564520 implements MigrationInterface {
    name = 'Chat1694403564520'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_446251f8ceb2132af01b68eb593"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_8d4c3f8a651da8bba8e3044e850"`);
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "gameId"`);
        await queryRunner.query(`ALTER TABLE "message" ADD "user_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "message" ADD "game_id" integer NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_54ce30caeb3f33d68398ea1037" ON "message" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_07f23fc9996f08ac23518249a0" ON "message" ("game_id") `);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_54ce30caeb3f33d68398ea10376" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_07f23fc9996f08ac23518249a00" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_07f23fc9996f08ac23518249a00"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_54ce30caeb3f33d68398ea10376"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_07f23fc9996f08ac23518249a0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_54ce30caeb3f33d68398ea1037"`);
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "game_id"`);
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "message" ADD "gameId" integer`);
        await queryRunner.query(`ALTER TABLE "message" ADD "userId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_8d4c3f8a651da8bba8e3044e850" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_446251f8ceb2132af01b68eb593" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
