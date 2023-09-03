import { MigrationInterface, QueryRunner } from "typeorm";

export class Cards1693763590999 implements MigrationInterface {
    name = 'Cards1693763590999'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."card_type_enum" AS ENUM('action', 'property', 'money', 'rent', 'wildcard')`);
        await queryRunner.query(`CREATE TABLE "card" ("id" SERIAL NOT NULL, "slug" character varying(255) NOT NULL, "name" character varying(255), "description" text, "type" "public"."card_type_enum" NOT NULL DEFAULT 'action', "value" smallint NOT NULL DEFAULT '0', "deck_quantity" smallint NOT NULL DEFAULT '1', "photo" text, CONSTRAINT "PK_9451069b6f1199730791a7f4ae4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_4b3fd86c797dbba10a66781743" ON "card" ("slug") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_4b3fd86c797dbba10a66781743"`);
        await queryRunner.query(`DROP TABLE "card"`);
        await queryRunner.query(`DROP TYPE "public"."card_type_enum"`);
    }

}
