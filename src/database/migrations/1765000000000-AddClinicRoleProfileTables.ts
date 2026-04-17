import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddClinicRoleProfileTables1765000000000 implements MigrationInterface {
  name = 'AddClinicRoleProfileTables1765000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`clinic_admin_profiles\` (
        \`id\` varchar(36) NOT NULL,
        \`professionalId\` varchar(36) NOT NULL,
        \`clinicId\` varchar(36) NULL,
        \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_clinic_admin_profiles_professional\` (\`professionalId\`),
        KEY \`IDX_clinic_admin_profiles_clinic\` (\`clinicId\`)
      ) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`secretary_profiles\` (
        \`id\` varchar(36) NOT NULL,
        \`professionalId\` varchar(36) NOT NULL,
        \`clinicId\` varchar(36) NULL,
        \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_secretary_profiles_professional\` (\`professionalId\`),
        KEY \`IDX_secretary_profiles_clinic\` (\`clinicId\`)
      ) ENGINE=InnoDB;
    `);

    await queryRunner.query(
      'ALTER TABLE `clinic_admin_profiles` ADD CONSTRAINT `FK_clinic_admin_profiles_professional` FOREIGN KEY (`professionalId`) REFERENCES `doctors`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;',
    );
    await queryRunner.query(
      'ALTER TABLE `clinic_admin_profiles` ADD CONSTRAINT `FK_clinic_admin_profiles_clinic` FOREIGN KEY (`clinicId`) REFERENCES `clinics`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;',
    );

    await queryRunner.query(
      'ALTER TABLE `secretary_profiles` ADD CONSTRAINT `FK_secretary_profiles_professional` FOREIGN KEY (`professionalId`) REFERENCES `doctors`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;',
    );
    await queryRunner.query(
      'ALTER TABLE `secretary_profiles` ADD CONSTRAINT `FK_secretary_profiles_clinic` FOREIGN KEY (`clinicId`) REFERENCES `clinics`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;',
    );

    await queryRunner.query(`
      INSERT INTO \`clinic_admin_profiles\` (\`id\`, \`professionalId\`, \`clinicId\`)
      SELECT UUID(), source.professionalId, source.clinicId
      FROM (
        SELECT cm.professionalId, MIN(cm.clinicId) AS clinicId
        FROM \`clinic_memberships\` cm
        WHERE cm.isActive = 1 AND cm.role = 'admin'
        GROUP BY cm.professionalId
      ) source;
    `);

    await queryRunner.query(`
      INSERT INTO \`secretary_profiles\` (\`id\`, \`professionalId\`, \`clinicId\`)
      SELECT UUID(), source.professionalId, source.clinicId
      FROM (
        SELECT cm.professionalId, MIN(cm.clinicId) AS clinicId
        FROM \`clinic_memberships\` cm
        WHERE cm.isActive = 1 AND cm.role = 'secretary'
        GROUP BY cm.professionalId
      ) source;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `secretary_profiles` DROP FOREIGN KEY `FK_secretary_profiles_clinic`;',
    );
    await queryRunner.query(
      'ALTER TABLE `secretary_profiles` DROP FOREIGN KEY `FK_secretary_profiles_professional`;',
    );
    await queryRunner.query(
      'ALTER TABLE `clinic_admin_profiles` DROP FOREIGN KEY `FK_clinic_admin_profiles_clinic`;',
    );
    await queryRunner.query(
      'ALTER TABLE `clinic_admin_profiles` DROP FOREIGN KEY `FK_clinic_admin_profiles_professional`;',
    );

    await queryRunner.query('DROP TABLE IF EXISTS `secretary_profiles`;');
    await queryRunner.query('DROP TABLE IF EXISTS `clinic_admin_profiles`;');
  }
}
