/* eslint-disable */
import type {MigrationInterface, QueryRunner} from "typeorm";

export class client1646560767650 implements MigrationInterface {
    name = 'client1646560767650'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "auth"."client" ("id" SERIAL NOT NULL, "clientId" character varying(128) NOT NULL, "clientName" character varying(1024) NOT NULL, "fields" jsonb NOT NULL, CONSTRAINT "UQ_6ed9067942d7537ce359e172ff6" UNIQUE ("clientId"), CONSTRAINT "PK_96da49381769303a6515a8785c7" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "auth"."client"`);
    }

}
