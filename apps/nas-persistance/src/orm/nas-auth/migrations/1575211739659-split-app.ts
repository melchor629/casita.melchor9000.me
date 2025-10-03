/* eslint-disable */
import type {MigrationInterface, QueryRunner} from "typeorm";

export class splitApp1575211739659 implements MigrationInterface {
    name = 'splitApp1575211739659'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "auth"."permission" DROP CONSTRAINT "CHECK_45d16f149472cfd795b683a8f5e"`, undefined);
        await queryRunner.query(`ALTER TABLE "auth"."permission" DROP CONSTRAINT "permission-name-type-key"`, undefined);
        await queryRunner.query(`CREATE TABLE "auth"."application" ("id" SERIAL NOT NULL, "key" character varying(32) NOT NULL, "name" character varying(500) NOT NULL, "kind" character varying(32), CONSTRAINT "PK_b50aa5a1c0644e601c0cdbf986d" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "application-key-unique" ON "auth"."application" ("key") `, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "application-apiKey-unique" ON "auth"."application" ("key")`, undefined);
        await queryRunner.query(`ALTER TABLE "auth"."permission" ADD "applicationId" integer`, undefined);

        await queryRunner.query(`INSERT INTO "auth"."application" (key, name) VALUES ('auth', 'NAS Auth API')`, undefined)
        await queryRunner.query(`INSERT INTO "auth"."application" (key, name) VALUES ('nas-web-app', 'NAS Web Application')`, undefined)
        await queryRunner.query(`INSERT INTO "auth"."application" (key, name, kind) SELECT "p"."name", "p"."name", 'fs' FROM "auth"."permission" "p" WHERE "p"."type" = 'fs'`, undefined)
        await queryRunner.query(`UPDATE "auth"."permission" SET "applicationId" = "auth"."application"."id" FROM "auth"."application" WHERE "auth"."application"."key" = "auth"."permission"."type"`, undefined)
        await queryRunner.query(`UPDATE "auth"."permission" SET "applicationId" = "auth"."application"."id" FROM "auth"."application" WHERE "auth"."application"."key" = "auth"."permission"."name" AND "auth"."permission"."type" = 'fs'`, undefined)
        await queryRunner.query(`UPDATE "auth"."permission" SET "name" = '*' WHERE "auth"."permission"."type" = 'fs'`, undefined)
        await queryRunner.query(`INSERT INTO "auth"."permission" (name, "applicationId") SELECT 'application', "a".id FROM "auth"."application" "a" WHERE "a"."key" = 'auth'`)

        await queryRunner.query(`ALTER TABLE "auth"."permission" ALTER COLUMN "applicationId" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "auth"."permission" DROP COLUMN "type"`, undefined);
        await queryRunner.query(`ALTER TABLE "auth"."permission" ADD CONSTRAINT "permission-name-application-key" UNIQUE ("name", "applicationId")`, undefined);
        await queryRunner.query(`ALTER TABLE "auth"."permission" ADD CONSTRAINT "FK_1ace3d0f1b1f0a9602ca087dff9" FOREIGN KEY ("applicationId") REFERENCES "auth"."application"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        throw new Error('Cannot rollback this migration')
    }

}
