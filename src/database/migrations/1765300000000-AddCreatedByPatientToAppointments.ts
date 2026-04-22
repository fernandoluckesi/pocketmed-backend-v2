import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreatedByPatientToAppointments1765300000000 implements MigrationInterface {
  name = 'AddCreatedByPatientToAppointments1765300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`appointments\` ADD \`createdByPatientId\` char(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`appointments\` ADD CONSTRAINT \`FK_appointments_createdByPatient\` FOREIGN KEY (\`createdByPatientId\`) REFERENCES \`patients\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `UPDATE \`appointments\` SET \`createdByPatientId\` = \`patientId\` WHERE \`patientId\` IS NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`appointments\` DROP FOREIGN KEY \`FK_appointments_createdByPatient\``,
    );
    await queryRunner.query(`ALTER TABLE \`appointments\` DROP COLUMN \`createdByPatientId\``);
  }
}
