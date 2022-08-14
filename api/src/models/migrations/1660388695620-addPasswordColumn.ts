import {MigrationInterface, QueryRunner} from "typeorm";

export class addPasswordColumn1660388695620 implements MigrationInterface {
    name = 'addPasswordColumn1660388695620'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`password\` varchar(255) NOT NULL COMMENT 'パスワード'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`password\``);
    }

}
