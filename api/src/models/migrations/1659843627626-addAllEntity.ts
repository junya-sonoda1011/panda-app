import {MigrationInterface, QueryRunner} from "typeorm";

export class addAllEntity1659843627626 implements MigrationInterface {
    name = 'addAllEntity1659843627626'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`snacks\` (\`created_at\` datetime(6) NOT NULL COMMENT '作成日時' DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT COMMENT '菓子ID', \`name\` varchar(255) NOT NULL COMMENT '菓子名称', \`standard_energy\` int NOT NULL COMMENT '基準エネルギー量', \`standard_weight\` int NOT NULL COMMENT '基準重量', \`display_name\` varchar(255) NULL COMMENT '菓子表示名称', \`unit_weight\` int NULL COMMENT '単位重量', \`unit_and_standard_weight_ratio\` int NULL COMMENT '単位基準重量比', \`is_unit_entered\` tinyint NOT NULL COMMENT '単位入力フラグ' DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`recorded_snacks\` (\`created_at\` datetime(6) NOT NULL COMMENT '作成日時' DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT COMMENT '被記録菓子ID', \`meal_record_id\` int NOT NULL COMMENT '食事記録ID', \`snack_id\` int NOT NULL COMMENT '菓子ID', \`unit_intake_weight\` int NOT NULL COMMENT '単位摂取量', \`unit_intake_energy\` int NOT NULL COMMENT '単位摂取エネルギー量', UNIQUE INDEX \`IDX_b68c68a06db2e1074ead807bdf\` (\`meal_record_id\`), UNIQUE INDEX \`IDX_a5c7730a85808b14ae7c34d770\` (\`snack_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`created_at\` datetime(6) NOT NULL COMMENT '作成日時' DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT COMMENT 'ユーザーID', \`name\` varchar(255) NOT NULL COMMENT 'ユーザー名', \`work\` varchar(255) NOT NULL COMMENT '仕事', \`hobby\` varchar(255) NOT NULL COMMENT '趣味', UNIQUE INDEX \`IDX_51b8b26ac168fbe7d6f5653e6c\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`meal_records\` (\`created_at\` datetime(6) NOT NULL COMMENT '作成日時' DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT COMMENT '食事記録ID', \`user_id\` int NOT NULL COMMENT 'ユーザーID', \`total_intake_energy\` int NOT NULL COMMENT '食事記録エネルギー量', UNIQUE INDEX \`IDX_307c42c009144ee563eaf06b05\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`recorded_snacks\` ADD CONSTRAINT \`FK_b68c68a06db2e1074ead807bdf9\` FOREIGN KEY (\`meal_record_id\`) REFERENCES \`meal_records\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`recorded_snacks\` ADD CONSTRAINT \`FK_a5c7730a85808b14ae7c34d770d\` FOREIGN KEY (\`snack_id\`) REFERENCES \`snacks\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`meal_records\` ADD CONSTRAINT \`FK_307c42c009144ee563eaf06b05c\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`meal_records\` DROP FOREIGN KEY \`FK_307c42c009144ee563eaf06b05c\``);
        await queryRunner.query(`ALTER TABLE \`recorded_snacks\` DROP FOREIGN KEY \`FK_a5c7730a85808b14ae7c34d770d\``);
        await queryRunner.query(`ALTER TABLE \`recorded_snacks\` DROP FOREIGN KEY \`FK_b68c68a06db2e1074ead807bdf9\``);
        await queryRunner.query(`DROP INDEX \`IDX_307c42c009144ee563eaf06b05\` ON \`meal_records\``);
        await queryRunner.query(`DROP TABLE \`meal_records\``);
        await queryRunner.query(`DROP INDEX \`IDX_51b8b26ac168fbe7d6f5653e6c\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_a5c7730a85808b14ae7c34d770\` ON \`recorded_snacks\``);
        await queryRunner.query(`DROP INDEX \`IDX_b68c68a06db2e1074ead807bdf\` ON \`recorded_snacks\``);
        await queryRunner.query(`DROP TABLE \`recorded_snacks\``);
        await queryRunner.query(`DROP TABLE \`snacks\``);
    }

}
