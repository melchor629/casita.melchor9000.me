/* eslint-disable */
import type { MigrationInterface, QueryRunner } from "typeorm";

export class dropKindAndCascades1662635932311 implements MigrationInterface {
    name = 'dropKindAndCascades1662635932311'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth"."permission" DROP CONSTRAINT "FK_2a032717ceae31ffbbc72a4805b"`);
        await queryRunner.query(`ALTER TABLE "auth"."user_permission" DROP CONSTRAINT "FK_a592f2df24c9d464afd71401ff6"`);
        await queryRunner.query(`ALTER TABLE "auth"."application" DROP COLUMN "kind"`);
        await queryRunner.query(`ALTER TABLE "auth"."permission" ADD CONSTRAINT "FK_2a032717ceae31ffbbc72a4805b" FOREIGN KEY ("applicationId") REFERENCES "auth"."application"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "auth"."user_permission" ADD CONSTRAINT "FK_a592f2df24c9d464afd71401ff6" FOREIGN KEY ("permissionId") REFERENCES "auth"."permission"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth"."user_permission" DROP CONSTRAINT "FK_a592f2df24c9d464afd71401ff6"`);
        await queryRunner.query(`ALTER TABLE "auth"."permission" DROP CONSTRAINT "FK_2a032717ceae31ffbbc72a4805b"`);
        await queryRunner.query(`ALTER TABLE "auth"."application" ADD "kind" character varying(32)`);
        await queryRunner.query(`ALTER TABLE "auth"."user_permission" ADD CONSTRAINT "FK_a592f2df24c9d464afd71401ff6" FOREIGN KEY ("permissionId") REFERENCES "auth"."permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "auth"."permission" ADD CONSTRAINT "FK_2a032717ceae31ffbbc72a4805b" FOREIGN KEY ("applicationId") REFERENCES "auth"."application"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
