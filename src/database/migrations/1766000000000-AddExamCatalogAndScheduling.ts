import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddExamCatalogAndScheduling1766000000000 implements MigrationInterface {
  name = 'AddExamCatalogAndScheduling1766000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`exam_categories\` (
        \`id\` varchar(36) NOT NULL,
        \`name\` varchar(255) NOT NULL,
        \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`exam_catalog\` (
        \`id\` varchar(36) NOT NULL,
        \`name\` varchar(255) NOT NULL,
        \`synonyms\` text NULL,
        \`categoryId\` varchar(36) NOT NULL,
        \`preparationInstructions\` text NULL,
        \`estimatedDuration\` int NOT NULL,
        \`price\` decimal(10,2) NOT NULL,
        \`isActive\` tinyint NOT NULL DEFAULT 1,
        \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`IDX_exam_catalog_categoryId\` (\`categoryId\`),
        KEY \`IDX_exam_catalog_isActive\` (\`isActive\`)
      ) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`exam_schedules\` (
        \`id\` varchar(36) NOT NULL,
        \`patientId\` varchar(36) NOT NULL,
        \`scheduledDateTime\` timestamp NOT NULL,
        \`status\` enum('pending','confirmed','cancelled') NOT NULL DEFAULT 'pending',
        \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`IDX_exam_schedules_patientId\` (\`patientId\`),
        KEY \`IDX_exam_schedules_status\` (\`status\`)
      ) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`exam_schedule_items\` (
        \`id\` varchar(36) NOT NULL,
        \`examScheduleId\` varchar(36) NOT NULL,
        \`examCatalogId\` varchar(36) NOT NULL,
        \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`IDX_exam_schedule_items_examScheduleId\` (\`examScheduleId\`),
        KEY \`IDX_exam_schedule_items_examCatalogId\` (\`examCatalogId\`)
      ) ENGINE=InnoDB;
    `);

    await queryRunner.query(
      'ALTER TABLE `exam_catalog` ADD CONSTRAINT `FK_exam_catalog_category` FOREIGN KEY (`categoryId`) REFERENCES `exam_categories`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION;',
    );

    await queryRunner.query(
      'ALTER TABLE `exam_schedules` ADD CONSTRAINT `FK_exam_schedules_patient` FOREIGN KEY (`patientId`) REFERENCES `patients`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;',
    );

    await queryRunner.query(
      'ALTER TABLE `exam_schedule_items` ADD CONSTRAINT `FK_exam_schedule_items_schedule` FOREIGN KEY (`examScheduleId`) REFERENCES `exam_schedules`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;',
    );

    await queryRunner.query(
      'ALTER TABLE `exam_schedule_items` ADD CONSTRAINT `FK_exam_schedule_items_catalog` FOREIGN KEY (`examCatalogId`) REFERENCES `exam_catalog`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION;',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `exam_schedule_items` DROP FOREIGN KEY `FK_exam_schedule_items_catalog`;',
    );
    await queryRunner.query(
      'ALTER TABLE `exam_schedule_items` DROP FOREIGN KEY `FK_exam_schedule_items_schedule`;',
    );
    await queryRunner.query(
      'ALTER TABLE `exam_schedules` DROP FOREIGN KEY `FK_exam_schedules_patient`;',
    );
    await queryRunner.query(
      'ALTER TABLE `exam_catalog` DROP FOREIGN KEY `FK_exam_catalog_category`;',
    );

    await queryRunner.query('DROP TABLE IF EXISTS `exam_schedule_items`;');
    await queryRunner.query('DROP TABLE IF EXISTS `exam_schedules`;');
    await queryRunner.query('DROP TABLE IF EXISTS `exam_catalog`;');
    await queryRunner.query('DROP TABLE IF EXISTS `exam_categories`;');
  }
}
