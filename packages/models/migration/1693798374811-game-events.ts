import { MigrationInterface, QueryRunner } from "typeorm";

export class GameEvents1693798374811 implements MigrationInterface {
    name = 'GameEvents1693798374811'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game_players" DROP CONSTRAINT "FK_b9adcb616544097a980720bbcc6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b9adcb616544097a980720bbcc"`);
        await queryRunner.query(`ALTER TABLE "game_players" RENAME COLUMN "user_id" TO "player_id"`);
        await queryRunner.query(`CREATE TABLE "game_events" ("id" SERIAL NOT NULL, "game_id" integer NOT NULL, "player_id" character varying, "sequence" smallint NOT NULL, "event_type" character varying NOT NULL, "data" jsonb, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_250946158c7913ba536add1e602" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5e9c9173e6d21d06023146b42e" ON "game_events" ("game_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_d492139104ffa39e9ac592dd85" ON "game_events" ("player_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_3b67d043ef93c599e201657a59" ON "game_players" ("player_id") `);
        await queryRunner.query(`ALTER TABLE "game_players" ADD CONSTRAINT "FK_3b67d043ef93c599e201657a590" FOREIGN KEY ("player_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game_events" ADD CONSTRAINT "FK_5e9c9173e6d21d06023146b42e3" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game_events" ADD CONSTRAINT "FK_d492139104ffa39e9ac592dd85a" FOREIGN KEY ("player_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game_events" DROP CONSTRAINT "FK_d492139104ffa39e9ac592dd85a"`);
        await queryRunner.query(`ALTER TABLE "game_events" DROP CONSTRAINT "FK_5e9c9173e6d21d06023146b42e3"`);
        await queryRunner.query(`ALTER TABLE "game_players" DROP CONSTRAINT "FK_3b67d043ef93c599e201657a590"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3b67d043ef93c599e201657a59"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d492139104ffa39e9ac592dd85"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5e9c9173e6d21d06023146b42e"`);
        await queryRunner.query(`DROP TABLE "game_events"`);
        await queryRunner.query(`ALTER TABLE "game_players" RENAME COLUMN "player_id" TO "user_id"`);
        await queryRunner.query(`CREATE INDEX "IDX_b9adcb616544097a980720bbcc" ON "game_players" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "game_players" ADD CONSTRAINT "FK_b9adcb616544097a980720bbcc6" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
