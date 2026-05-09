import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PatientsModule } from './patients/patients.module';
import { DependentsModule } from './dependents/dependents.module';
import { DoctorsModule } from './doctors/doctors.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { MedicationsModule } from './medications/medications.module';
import { ExamsModule } from './exams/exams.module';
import { AvailabilityModule } from './availability/availability.module';
import { UploadModule } from './upload/upload.module';
import { EmailModule } from './email/email.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { Patient } from './entities/patient.entity';
import { Doctor } from './entities/doctor.entity';
import { Dependent } from './entities/dependent.entity';
import { Appointment } from './entities/appointment.entity';
import { Medication } from './entities/medication.entity';
import { Exam } from './entities/exam.entity';
import { DoctorAccessRequest } from './entities/doctor-access-request.entity';
import { DoctorPermission } from './entities/doctor-permission.entity';
import { AvailabilityRule } from './entities/availability-rule.entity';
import { AvailabilityException } from './entities/availability-exception.entity';
import { DeviceToken } from './entities/device-token.entity';
import { Notification } from './entities/notification.entity';
import { Clinic } from './entities/clinic.entity';
import { ClinicMembership } from './entities/clinic-membership.entity';
import { ClinicAdminProfile } from './entities/clinic-admin-profile.entity';
import { SecretaryProfile } from './entities/secretary-profile.entity';
import { ExamCategory } from './entities/exam-category.entity';
import { ExamCatalog } from './entities/exam-catalog.entity';
import { ExamSchedule } from './entities/exam-schedule.entity';
import { ExamScheduleItem } from './entities/exam-schedule-item.entity';
import { NotificationsModule } from './notifications/notifications.module';
import { ClinicAdminModule } from './clinic-admin/clinic-admin.module';
import { ExamCatalogModule } from './exam-catalog/exam-catalog.module';
import { ExamSchedulingModule } from './exam-scheduling/exam-scheduling.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [
          Patient,
          Doctor,
          Dependent,
          Appointment,
          Medication,
          Exam,
          DoctorAccessRequest,
          DoctorPermission,
          AvailabilityRule,
          AvailabilityException,
          DeviceToken,
          Notification,
          Clinic,
          ClinicMembership,
          ClinicAdminProfile,
          SecretaryProfile,
          ExamCategory,
          ExamCatalog,
          ExamSchedule,
          ExamScheduleItem,
        ],
        migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
        synchronize: false,
        logging: false,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    PatientsModule,
    DependentsModule,
    DoctorsModule,
    AppointmentsModule,
    MedicationsModule,
    ExamsModule,
    AvailabilityModule,
    UploadModule,
    EmailModule,
    NotificationsModule,
    ClinicAdminModule,
    ExamCatalogModule,
    ExamSchedulingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
