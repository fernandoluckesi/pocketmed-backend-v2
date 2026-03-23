import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('device_tokens')
export class DeviceToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 36 })
  userId: string;

  @Column({ type: 'varchar', length: 20 })
  userType: string; // 'patient' | 'doctor'

  @Column({ type: 'varchar', length: 512 })
  expoPushToken: string;

  @Column({ type: 'varchar', length: 20, default: 'unknown' })
  platform: string; // 'ios' | 'android' | 'unknown'

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  lastSeenAt: Date;
}
