/* eslint-disable */
import type {MigrationInterface, QueryRunner,} from "typeorm";

export class initial1554574747417 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const schema: string = (queryRunner.connection.options as any).schema || 'public';
        await queryRunner.query(`CREATE TABLE "${schema}"."permission" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "type" character varying NOT NULL DEFAULT 'fs', CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"), CONSTRAINT "CHECK_45d16f149472cfd795b683a8f5e" CHECK ("type" IN ('auth', 'fs')))`);
        await queryRunner.query(`CREATE TABLE "${schema}"."user_permission" ("id" SERIAL NOT NULL, "write" boolean NOT NULL DEFAULT false, "delete" boolean NOT NULL DEFAULT false, "userId" integer NOT NULL, "permissionId" integer NOT NULL, CONSTRAINT "PK_a7326749e773c740a7104634a77" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "${schema}"."user" ("id" SERIAL NOT NULL, "userName" character varying NOT NULL, "displayName" character varying NOT NULL, "email" character varying, "disabled" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "${schema}"."login" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "loginId" character varying NOT NULL, "data" jsonb DEFAULT null, "disabled" boolean NOT NULL DEFAULT false, "userId" integer NOT NULL, CONSTRAINT "PK_0e29aa96b7d3fb812ff43fcfcd3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_204cd5e1949e4f4f73139dc7d0" ON "${schema}"."login" ("type", "loginId") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_1cf6c7f47d0655afa389e1bd59" ON "${schema}"."user_permission" ("userId", "permissionId") `);
        await queryRunner.query(`ALTER TABLE "${schema}"."user_permission" ADD CONSTRAINT "FK_deb59c09715314aed1866e18a81" FOREIGN KEY ("userId") REFERENCES "${schema}"."user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "${schema}"."user_permission" ADD CONSTRAINT "FK_a592f2df24c9d464afd71401ff6" FOREIGN KEY ("permissionId") REFERENCES "${schema}"."permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "${schema}"."login" ADD CONSTRAINT "FK_b1c3fff7c4bc7d15b3018abab6f" FOREIGN KEY ("userId") REFERENCES "${schema}"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const schema: string = (queryRunner.connection.options as any).schema || 'public';
        await queryRunner.query(`ALTER TABLE "${schema}"."login" DROP CONSTRAINT "FK_b1c3fff7c4bc7d15b3018abab6f"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."user_permission" DROP CONSTRAINT "FK_a592f2df24c9d464afd71401ff6"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."user_permission" DROP CONSTRAINT "FK_deb59c09715314aed1866e18a81"`);
        await queryRunner.query(`DROP INDEX "IDX_204cd5e1949e4f4f73139dc7d0"`);
        await queryRunner.query(`DROP INDEX "IDX_1cf6c7f47d0655afa389e1bd59"`);
        await queryRunner.query(`DROP TABLE "${schema}"."login"`);
        await queryRunner.query(`DROP TABLE "${schema}"."user"`);
        await queryRunner.query(`DROP TABLE "${schema}"."user_permission"`);
        await queryRunner.query(`DROP TABLE "${schema}"."permission"`);
    }

}
