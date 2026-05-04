import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExamSchedule, ExamScheduleStatus } from '../entities/exam-schedule.entity';
import { ExamScheduleItem } from '../entities/exam-schedule-item.entity';
import { CreateExamScheduleDto } from './dto/create-exam-schedule.dto';

@Injectable()
export class ExamSchedulingService {
  constructor(
    @InjectRepository(ExamSchedule)
    private examScheduleRepository: Repository<ExamSchedule>,
    @InjectRepository(ExamScheduleItem)
    private examScheduleItemRepository: Repository<ExamScheduleItem>,
  ) {}

  async create(patientId: string, dto: CreateExamScheduleDto): Promise<ExamSchedule> {
    if (!dto.examIds || dto.examIds.length === 0) {
      throw new BadRequestException(
        'A lista de exames não pode estar vazia. Selecione pelo menos um exame.',
      );
    }

    const scheduledDateTime = new Date(dto.scheduledDateTime);
    if (scheduledDateTime <= new Date()) {
      throw new BadRequestException(
        'A data e horário do agendamento não podem estar no passado.',
      );
    }

    const schedule = this.examScheduleRepository.create({
      patientId,
      scheduledDateTime,
      status: ExamScheduleStatus.PENDING,
    });

    const savedSchedule = await this.examScheduleRepository.save(schedule);

    const items = dto.examIds.map((examCatalogId) =>
      this.examScheduleItemRepository.create({
        examScheduleId: savedSchedule.id,
        examCatalogId,
      }),
    );

    await this.examScheduleItemRepository.save(items);

    return this.examScheduleRepository.findOne({
      where: { id: savedSchedule.id },
      relations: ['items', 'items.examCatalog', 'items.examCatalog.category'],
    });
  }

  async findAllByPatient(patientId: string): Promise<ExamSchedule[]> {
    return this.examScheduleRepository.find({
      where: { patientId },
      relations: ['items', 'items.examCatalog', 'items.examCatalog.category'],
      order: { scheduledDateTime: 'ASC' },
    });
  }

  async findOneByPatient(id: string, patientId: string): Promise<ExamSchedule | null> {
    return this.examScheduleRepository.findOne({
      where: { id, patientId },
      relations: ['items', 'items.examCatalog', 'items.examCatalog.category'],
    });
  }

  async update(id: string, patientId: string, data: { status?: string; scheduledDateTime?: string }): Promise<ExamSchedule> {
    const schedule = await this.findOneByPatient(id, patientId);
    if (!schedule) {
      throw new BadRequestException('Agendamento não encontrado.');
    }
    if (data.status) {
      (schedule as any).status = data.status;
    }
    if (data.scheduledDateTime) {
      schedule.scheduledDateTime = new Date(data.scheduledDateTime);
    }
    return this.examScheduleRepository.save(schedule);
  }

  async remove(id: string, patientId: string): Promise<void> {
    const schedule = await this.findOneByPatient(id, patientId);
    if (!schedule) {
      throw new BadRequestException('Agendamento não encontrado.');
    }
    await this.examScheduleItemRepository.delete({ examScheduleId: id });
    await this.examScheduleRepository.delete({ id });
  }
}
