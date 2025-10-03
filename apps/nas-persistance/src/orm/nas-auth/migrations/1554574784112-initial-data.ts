/* eslint-disable */
import type {MigrationInterface, QueryRunner} from "typeorm";

export class initialData1554574784112 implements MigrationInterface {

    private static permissions: [string, 'fs' | 'auth'][] = [
        ['public', 'fs'],
        ['user', 'auth'],
        ['login', 'auth'],
        ['permission', 'auth'],
        ['token', 'auth'],
    ];

    public async up(queryRunner: QueryRunner): Promise<any> {
        const schema: string = (queryRunner.connection.options as any).schema || 'public';
        const permissions = initialData1554574784112.permissions.map(([name, type]) => `('${name}', '${type}')`).join(', ');
        await queryRunner.query(`INSERT INTO "${schema}"."permission" ("name", "type") VALUES ${permissions}`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const schema: string = (queryRunner.connection.options as any).schema || 'public';
        const permissions = initialData1554574784112.permissions.map(([name, type]) => `DELETE FROM "${schema}"."permission" WHERE "name"='${name}' AND "type"='${type}'`);
        for(let permissionQuery of permissions) {
            await queryRunner.query(permissionQuery);
        }
    }

}
