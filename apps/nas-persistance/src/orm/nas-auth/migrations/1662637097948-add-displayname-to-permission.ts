/* eslint-disable */
import type { MigrationInterface, QueryRunner } from "typeorm";

export class addDisplaynameToPermission1662637097948 implements MigrationInterface {
    name = 'addDisplaynameToPermission1662637097948'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth"."permission" ADD "displayName" character varying(1000)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth"."permission" DROP COLUMN "displayName"`);
    }

}
