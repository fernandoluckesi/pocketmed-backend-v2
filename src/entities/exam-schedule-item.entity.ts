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

  @Column({ type: 'uuid', nullable: true })
  examCatalogId: string | null;

  @ManyToOne(() => ExamCatalog, { nullable: true })
  @JoinColumn({ name: 'examCatalogId' })
  examCatalog: ExamCatalog | null;

  /** Name entered manually by the patient when the exam is not in the catalog */
  @Column({ type: 'varchar', length: 255, nullable: true })
  customExamName: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
