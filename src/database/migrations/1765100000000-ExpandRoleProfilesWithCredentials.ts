import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExpandRoleProfilesWithCredentials1765100000000 implements MigrationInterface {
  name = 'ExpandRoleProfilesWithCredentials1765100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `clinic_admin_profiles` DROP FOREIGN KEY `FK_clinic_admin_profiles_professional`;',
    );
    await queryRunner.query(
      'ALTER TABLE `secretary_profiles` DROP FOREIGN KEY `FK_secretary_profiles_professional`;',
    );

    await queryRunner.query(
      'ALTER TABLE `clinic_admin_profiles` MODIFY `professionalId` varchar(36) NULL;',
    );
    await queryRunner.query(
      'ALTER TABLE `secretary_profiles` MODIFY `professionalId` varchar(36) NULL;',
    );

    await queryRunner.query(
      "ALTER TABLE `clinic_admin_profiles` ADD `name` varchar(255) NOT NULL DEFAULT '';",
    );
    await queryRunner.query('ALTER TABLE `clinic_admin_profiles` ADD `email` varchar(255) NULL;');
    await queryRunner.query(
      'ALTER TABLE `clinic_admin_profiles` ADD `password` varchar(255) NULL;',
    );
    await queryRunner.query(
      "ALTER TABLE `clinic_admin_profiles` ADD `phone` varchar(20) NOT NULL DEFAULT '';",
    );
    await queryRunner.query(
      'ALTER TABLE `clinic_admin_profiles` ADD `profileImage` varchar(500) NULL;',
    );
    await queryRunner.query('ALTER TABLE `clinic_admin_profiles` ADD `gender` varchar(50) NULL;');
    await queryRunner.query('ALTER TABLE `clinic_admin_profiles` ADD `birthDate` date NULL;');
    await queryRunner.query('ALTER TABLE `clinic_admin_profiles` ADD `cpf` varchar(14) NULL;');

    await queryRunner.query(
      "ALTER TABLE `secretary_profiles` ADD `name` varchar(255) NOT NULL DEFAULT '';",
    );
    await queryRunner.query('ALTER TABLE `secretary_profiles` ADD `email` varchar(255) NULL;');
    await queryRunner.query('ALTER TABLE `secretary_profiles` ADD `password` varchar(255) NULL;');
    await queryRunner.query(
      "ALTER TABLE `secretary_profiles` ADD `phone` varchar(20) NOT NULL DEFAULT '';",
    );
    await queryRunner.query(
      'ALTER TABLE `secretary_profiles` ADD `profileImage` varchar(500) NULL;',
    );
    await queryRunner.query('ALTER TABLE `secretary_profiles` ADD `gender` varchar(50) NULL;');
    await queryRunner.query('ALTER TABLE `secretary_profiles` ADD `birthDate` date NULL;');
    await queryRunner.query('ALTER TABLE `secretary_profiles` ADD `cpf` varchar(14) NULL;');

    await queryRunner.query(`
      UPDATE \`clinic_admin_profiles\` profile
      INNER JOIN \`doctors\` professional ON professional.id = profile.professionalId
      SET
        profile.name = professional.name,
        profile.email = professional.email,
        profile.password = professional.password,
        profile.phone = professional.phone,
        profile.profileImage = professional.profileImage,
        profile.gender = professional.gender,
        profile.birthDate = professional.birthDate,
        profile.cpf = professional.cpf;
    `);

    await queryRunner.query(`
      UPDATE \`secretary_profiles\` profile
      INNER JOIN \`doctors\` professional ON professional.id = profile.professionalId
      SET
        profile.name = professional.name,
        profile.email = professional.email,
        profile.password = professional.password,
        profile.phone = professional.phone,
        profile.profileImage = professional.profileImage,
        profile.gender = professional.gender,
        profile.birthDate = professional.birthDate,
        profile.cpf = professional.cpf;
    `);

    await queryRunner.query(
      'ALTER TABLE `clinic_admin_profiles` ADD UNIQUE INDEX `UQ_clinic_admin_profiles_email` (`email`);',
    );
    await queryRunner.query(
      'ALTER TABLE `secretary_profiles` ADD UNIQUE INDEX `UQ_secretary_profiles_email` (`email`);',
    );

    await queryRunner.query(
      'ALTER TABLE `clinic_admin_profiles` ADD CONSTRAINT `FK_clinic_admin_profiles_professional` FOREIGN KEY (`professionalId`) REFERENCES `doctors`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;',
    );
    await queryRunner.query(
      'ALTER TABLE `secretary_profiles` ADD CONSTRAINT `FK_secretary_profiles_professional` FOREIGN KEY (`professionalId`) REFERENCES `doctors`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `clinic_admin_profiles` DROP FOREIGN KEY `FK_clinic_admin_profiles_professional`;',
    );
    await queryRunner.query(
      'ALTER TABLE `secretary_profiles` DROP FOREIGN KEY `FK_secretary_profiles_professional`;',
    );

    await queryRunner.query(
      'ALTER TABLE `clinic_admin_profiles` DROP INDEX `UQ_clinic_admin_profiles_email`;',
    );
    await queryRunner.query(
      'ALTER TABLE `secretary_profiles` DROP INDEX `UQ_secretary_profiles_email`;',
    );

    await queryRunner.query('ALTER TABLE `clinic_admin_profiles` DROP COLUMN `cpf`;');
    await queryRunner.query('ALTER TABLE `clinic_admin_profiles` DROP COLUMN `birthDate`;');
    await queryRunner.query('ALTER TABLE `clinic_admin_profiles` DROP COLUMN `gender`;');
    await queryRunner.query('ALTER TABLE `clinic_admin_profiles` DROP COLUMN `profileImage`;');
    await queryRunner.query('ALTER TABLE `clinic_admin_profiles` DROP COLUMN `phone`;');
    await queryRunner.query('ALTER TABLE `clinic_admin_profiles` DROP COLUMN `password`;');
    await queryRunner.query('ALTER TABLE `clinic_admin_profiles` DROP COLUMN `email`;');
    await queryRunner.query('ALTER TABLE `clinic_admin_profiles` DROP COLUMN `name`;');

    await queryRunner.query('ALTER TABLE `secretary_profiles` DROP COLUMN `cpf`;');
    await queryRunner.query('ALTER TABLE `secretary_profiles` DROP COLUMN `birthDate`;');
    await queryRunner.query('ALTER TABLE `secretary_profiles` DROP COLUMN `gender`;');
    await queryRunner.query('ALTER TABLE `secretary_profiles` DROP COLUMN `profileImage`;');
    await queryRunner.query('ALTER TABLE `secretary_profiles` DROP COLUMN `phone`;');
    await queryRunner.query('ALTER TABLE `secretary_profiles` DROP COLUMN `password`;');
    await queryRunner.query('ALTER TABLE `secretary_profiles` DROP COLUMN `email`;');
    await queryRunner.query('ALTER TABLE `secretary_profiles` DROP COLUMN `name`;');

    await queryRunner.query(
      'ALTER TABLE `clinic_admin_profiles` MODIFY `professionalId` varchar(36) NOT NULL;',
    );
    await queryRunner.query(
      'ALTER TABLE `secretary_profiles` MODIFY `professionalId` varchar(36) NOT NULL;',
    );

    await queryRunner.query(
      'ALTER TABLE `clinic_admin_profiles` ADD CONSTRAINT `FK_clinic_admin_profiles_professional` FOREIGN KEY (`professionalId`) REFERENCES `doctors`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;',
    );
    await queryRunner.query(
      'ALTER TABLE `secretary_profiles` ADD CONSTRAINT `FK_secretary_profiles_professional` FOREIGN KEY (`professionalId`) REFERENCES `doctors`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;',
    );
  }
}
