/* eslint-disable */
import type {MigrationInterface, QueryRunner} from "typeorm";

export class addProfileFieldsToUser1641655363160 implements MigrationInterface {
    name = 'addProfileFieldsToUser1641655363160'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth"."permission" DROP CONSTRAINT "FK_1ace3d0f1b1f0a9602ca087dff9"`);
        await queryRunner.query(`DROP INDEX "auth"."application-key-unique"`);
        await queryRunner.query(`ALTER TABLE "auth"."user" ADD "familyName" character varying(512)`);
        await queryRunner.query(`ALTER TABLE "auth"."user" ADD "givenName" character varying(512)`);
        await queryRunner.query(`ALTER TABLE "auth"."user" ADD "profileImageUrl" character varying(4096)`);
        await queryRunner.query(`ALTER TABLE "auth"."permission" ADD CONSTRAINT "FK_2a032717ceae31ffbbc72a4805b" FOREIGN KEY ("applicationId") REFERENCES "auth"."application"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth"."permission" DROP CONSTRAINT "FK_2a032717ceae31ffbbc72a4805b"`);
        await queryRunner.query(`ALTER TABLE "auth"."user" DROP COLUMN "profileImageUrl"`);
        await queryRunner.query(`ALTER TABLE "auth"."user" DROP COLUMN "givenName"`);
        await queryRunner.query(`ALTER TABLE "auth"."user" DROP COLUMN "familyName"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "application-key-unique" ON "auth"."application" ("key") `);
        await queryRunner.query(`ALTER TABLE "auth"."permission" ADD CONSTRAINT "FK_1ace3d0f1b1f0a9602ca087dff9" FOREIGN KEY ("applicationId") REFERENCES "auth"."application"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
