import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ExamCategory } from './exam-category.entity';

@Entity('exam_catalog')
export class ExamCatalog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  synonyms: string;

  @Column({ type: 'uuid' })
  categoryId: string;

  @ManyToOne(() => ExamCategory, (category) => category.exams)
  @JoinColumn({ name: 'categoryId' })
  category: ExamCategory;

  @Column({ type: 'text', nullable: true })
  preparationInstructions: string;

  @Column({ type: 'int' })
  estimatedDuration: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
