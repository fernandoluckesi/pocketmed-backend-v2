import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Patient } from './patient.entity';
import { ExamScheduleItem } from './exam-schedule-item.entity';

export enum ExamScheduleStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

@Entity('exam_schedules')
export class ExamSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  patientId: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column({ type: 'timestamp' })
  scheduledDateTime: Date;

  @Column({
    type: 'enum',
    enum: ExamScheduleStatus,
    default: ExamScheduleStatus.PENDING,
  })
  status: ExamScheduleStatus;

  @OneToMany(() => ExamScheduleItem, (item) => item.examSchedule)
  items: ExamScheduleItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
