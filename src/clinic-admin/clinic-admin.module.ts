import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicAdminController } from './clinic-admin.controller';
import { ClinicAdminService } from './clinic-admin.service';
import { ClinicMembership } from '../entities/clinic-membership.entity';
import { Clinic } from '../entities/clinic.entity';
import { Doctor } from '../entities/doctor.entity';
import { Patient } from '../entities/patient.entity';
import { DoctorPermission } from '../entities/doctor-permission.entity';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClinicMembership, Clinic, Doctor, Patient, DoctorPermission]),
    EmailModule,
  ],
  controllers: [ClinicAdminController],
  providers: [ClinicAdminService],
  exports: [ClinicAdminService],
})
export class ClinicAdminModule {}
