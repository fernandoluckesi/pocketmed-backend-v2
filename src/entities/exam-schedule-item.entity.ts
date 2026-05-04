import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ExamSchedule } from './exam-schedule.entity';
import { ExamCatalog } from './exam-catalog.entity';

@Entity('exam_schedule_items')
export class ExamScheduleItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  examScheduleId: string;

  @ManyToOne(() => ExamSchedule, (schedule) => schedule.items)
  @JoinColumn({ name: 'examScheduleId' })
  examSchedule: ExamSchedule;

  @Column({ type: 'uuid' })
  examCatalogId: string;

  @ManyToOne(() => ExamCatalog)
  @JoinColumn({ name: 'examCatalogId' })
  examCatalog: ExamCatalog;

  @CreateDateColumn()
  createdAt: Date;
}
