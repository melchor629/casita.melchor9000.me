/* eslint-disable */
import type {MigrationInterface, QueryRunner} from "typeorm";

export class limits1566056491656 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "auth"."permission" ALTER COLUMN "name" TYPE character varying(100)`);
        await queryRunner.query(`ALTER TABLE "auth"."user" ALTER COLUMN "userName" TYPE character varying(100)`);
        await queryRunner.query(`ALTER TABLE "auth"."user" ALTER COLUMN "displayName" TYPE character varying(512)`);
        await queryRunner.query(`ALTER TABLE "auth"."user" ALTER COLUMN "email" TYPE character varying(1024)`);
        await queryRunner.query(`ALTER TABLE "auth"."login" ALTER COLUMN "type" TYPE character varying(50)`);
        await queryRunner.query(`ALTER TABLE "auth"."login" ALTER COLUMN "loginId" TYPE character varying(2048)`);
        await queryRunner.query(`ALTER TABLE "auth"."permission" ADD CONSTRAINT "permission-name-type-key" UNIQUE ("name", "type")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "auth"."permission" ALTER COLUMN "name" TYPE character varying`);
        await queryRunner.query(`ALTER TABLE "auth"."user" ALTER COLUMN "userName" TYPE character varying`);
        await queryRunner.query(`ALTER TABLE "auth"."user" ALTER COLUMN "displayName" TYPE character varying`);
        await queryRunner.query(`ALTER TABLE "auth"."user" ALTER COLUMN "email" TYPE character varying`);
        await queryRunner.query(`ALTER TABLE "auth"."login" ALTER COLUMN "type" TYPE character varying`);
        await queryRunner.query(`ALTER TABLE "auth"."login" ALTER COLUMN "loginId" TYPE character varying`);
        await queryRunner.query(`ALTER TABLE "auth"."permission" DROP CONSTRAINT "permission-name-type-key"`);
    }

}
