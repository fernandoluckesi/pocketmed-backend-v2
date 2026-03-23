import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', length: 36 })
  userId: string;

  /** 'patient' | 'dependent' | 'doctor' */
  @Column({ name: 'user_type', length: 20 })
  userType: string;

  /** e.g. ACCESS_REQUEST_CREATED, ACCESS_REQUEST_RESPONDED */
  @Column({ length: 60 })
  type: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  body: string;

  /** arbitrary JSON payload — same data that was sent via push */
  @Column({ type: 'json', nullable: true })
  data: Record<string, unknown> | null;

  /** id of the related entity (e.g. access-request id) */
  @Column({ name: 'related_entity_id', length: 36, nullable: true })
  relatedEntityId: string | null;

  @Column({ name: 'is_read', default: false })
  isRead: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
