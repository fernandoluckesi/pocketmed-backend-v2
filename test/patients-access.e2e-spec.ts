import { CanActivate, Controller, ExecutionContext, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { PatientsController } from '../src/patients/patients.controller';
import { PatientsService } from '../src/patients/patients.service';
import { Patient } from '../src/entities/patient.entity';
import { DoctorPermission } from '../src/entities/doctor-permission.entity';
import { ClinicMembership } from '../src/entities/clinic-membership.entity';

class TestJwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    req.user = {
      userId: String(req.headers['x-user-id'] || 'doctor-id-1'),
      type: String(req.headers['x-user-type'] || 'doctor'),
      role: req.headers['x-user-role'] ? String(req.headers['x-user-role']) : 'doctor',
      activeClinicId: req.headers['x-active-clinic-id']
        ? String(req.headers['x-active-clinic-id'])
        : null,
    };
    return true;
  }
}

const patientRepositoryMock = {
  find: jest.fn().mockResolvedValue([]),
  findOne: jest.fn().mockResolvedValue({
    id: 'patient-1',
    name: 'Patient One',
    email: 'patient1@email.com',
    doctorCreatorId: 'doctor-id-1',
  }),
};

const doctorPermissionQueryBuilderMock = {
  select: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  getRawMany: jest.fn().mockResolvedValue([]),
};

const doctorPermissionRepositoryMock = {
  createQueryBuilder: jest.fn().mockReturnValue(doctorPermissionQueryBuilderMock),
  findOne: jest.fn().mockResolvedValue(null),
};

const clinicMembershipRepositoryMock = {
  find: jest.fn().mockResolvedValue([]),
};

describe('Patients authorization (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PatientsController],
      providers: [
        PatientsService,
        { provide: getRepositoryToken(Patient), useValue: patientRepositoryMock },
        {
          provide: getRepositoryToken(DoctorPermission),
          useValue: doctorPermissionRepositoryMock,
        },
        { provide: getRepositoryToken(ClinicMembership), useValue: clinicMembershipRepositoryMock },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(TestJwtGuard)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 403 for secretary listing patients', async () => {
    await request(app.getHttpServer())
      .get('/patients')
      .set('x-user-type', 'doctor')
      .set('x-user-role', 'secretary')
      .expect(403);
  });

  it('returns 403 for admin searching patients', async () => {
    await request(app.getHttpServer())
      .get('/patients/search?q=maria')
      .set('x-user-type', 'doctor')
      .set('x-user-role', 'admin')
      .expect(403);
  });

  it('returns 403 for secretary listing my patients', async () => {
    await request(app.getHttpServer())
      .get('/patients/my')
      .set('x-user-type', 'doctor')
      .set('x-user-role', 'secretary')
      .expect(403);
  });

  it('returns 403 for admin viewing patient details', async () => {
    await request(app.getHttpServer())
      .get('/patients/patient-1')
      .set('x-user-type', 'doctor')
      .set('x-user-role', 'admin')
      .expect(403);
  });

  it('allows doctor to list patients', async () => {
    await request(app.getHttpServer())
      .get('/patients')
      .set('x-user-type', 'doctor')
      .set('x-user-role', 'doctor')
      .expect(200);
  });
});
