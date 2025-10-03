/* eslint-disable */
import type {MigrationInterface, QueryRunner} from "typeorm";

export class apiResources1647090505431 implements MigrationInterface {
    name = 'apiResources1647090505431'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "auth"."api_resource" ("id" SERIAL NOT NULL, "key" character varying(500) NOT NULL, "name" character varying(1000) NOT NULL, "scopes" jsonb NOT NULL, "audience" character varying(1000) NOT NULL, "accessTokenFormat" character varying(50) NOT NULL DEFAULT 'jwt', "accessTokenTTL" integer, "jwt" jsonb, "paseto" jsonb, "applicationId" integer NOT NULL, CONSTRAINT "PK_f80ccb48a19c807aa53d90dd66b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "api-resource-key-unique" ON "auth"."api_resource" ("key") `);
        await queryRunner.query(`ALTER TABLE "auth"."api_resource" ADD CONSTRAINT "FK_7c34867275a5cc746b6d4fd75ed" FOREIGN KEY ("applicationId") REFERENCES "auth"."application"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth"."api_resource" DROP CONSTRAINT "FK_7c34867275a5cc746b6d4fd75ed"`);
        await queryRunner.query(`DROP INDEX "auth"."api-resource-key-unique"`);
        await queryRunner.query(`DROP TABLE "auth"."api_resource"`);
    }

}
