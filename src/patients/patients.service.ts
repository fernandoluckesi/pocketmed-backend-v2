import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Patient } from '../entities/patient.entity';
import { DoctorPermission } from '../entities/doctor-permission.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(DoctorPermission)
    private permissionRepository: Repository<DoctorPermission>,
  ) {}

  async findAll(userType: string, userId?: string) {
    if (userType !== 'doctor') {
      throw new ForbiddenException('Only doctors can view all patients');
    }

    const patients = await this.patientRepository.find({
      select: [
        'id',
        'name',
        'email',
        'gender',
        'phone',
        'birthDate',
        'profileImage',
        'type',
        'isShadow',
        'doctorCreatorId',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!userId || patients.length === 0) {
      return patients.map((patient) => ({
        ...patient,
        createdByDoctorId: patient.doctorCreatorId,
        hasPermission: false,
        hasAccess: false,
      }));
    }

    const patientIds = patients.map((patient) => patient.id);
    const permissions = await this.permissionRepository
      .createQueryBuilder('permission')
      .select('permission.patientId', 'patientId')
      .where('permission.doctorId = :doctorId', { doctorId: userId })
      .andWhere('permission.isActive = :isActive', { isActive: true })
      .andWhere('permission.patientId IN (:...patientIds)', { patientIds })
      .getRawMany<{ patientId: string }>();

    const patientIdsWithPermission = new Set(permissions.map((p) => p.patientId));

    return patients.map((patient) => {
      const hasPermission = patientIdsWithPermission.has(patient.id);
      return {
        ...patient,
        createdByDoctorId: patient.doctorCreatorId,
        hasPermission,
        hasAccess: hasPermission,
      };
    });
  }

  async findOne(id: string, userId: string, userType: string) {
    const patient = await this.patientRepository.findOne({
      where: { id },
      select: [
        'id',
        'name',
        'email',
        'gender',
        'phone',
        'birthDate',
        'profileImage',
        'type',
        'isShadow',
        'doctorCreatorId',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    if (userType === 'patient' && patient.id !== userId) {
      throw new ForbiddenException('You can only view your own profile');
    }

    if (userType === 'doctor' && userId) {
      const isCreator = patient.doctorCreatorId === userId;
      let hasPermission = isCreator;

      if (!isCreator) {
        const permission = await this.permissionRepository.findOne({
          where: { doctorId: userId, patientId: id, isActive: true },
        });
        hasPermission = !!permission;
      }

      return {
        ...patient,
        createdByDoctorId: patient.doctorCreatorId,
        hasPermission,
        hasAccess: hasPermission,
      };
    }

    return patient;
  }

  async search(query: string, userType: string, userId?: string) {
    if (userType !== 'doctor') {
      throw new ForbiddenException('Only doctors can search patients');
    }

    if (query.length < 3) {
      throw new ForbiddenException('Search query must be at least 3 characters');
    }

    const patients = await this.patientRepository.find({
      where: [{ name: Like(`%${query}%`) }, { email: Like(`%${query}%`) }],
      select: [
        'id',
        'name',
        'email',
        'gender',
        'phone',
        'birthDate',
        'profileImage',
        'type',
        'isShadow',
        'doctorCreatorId',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!userId || patients.length === 0) {
      return patients.map((patient) => ({
        ...patient,
        createdByDoctorId: patient.doctorCreatorId,
        hasPermission: false,
        hasAccess: false,
      }));
    }

    const patientIds = patients.map((patient) => patient.id);
    const permissions = await this.permissionRepository
      .createQueryBuilder('permission')
      .select('permission.patientId', 'patientId')
      .where('permission.doctorId = :doctorId', { doctorId: userId })
      .andWhere('permission.isActive = :isActive', { isActive: true })
      .andWhere('permission.patientId IN (:...patientIds)', { patientIds })
      .getRawMany<{ patientId: string }>();

    const patientIdsWithPermission = new Set(permissions.map((p) => p.patientId));

    return patients.map((patient) => {
      const hasPermission = patientIdsWithPermission.has(patient.id);
      return {
        ...patient,
        createdByDoctorId: patient.doctorCreatorId,
        hasPermission,
        hasAccess: hasPermission,
      };
    });
  }
}
