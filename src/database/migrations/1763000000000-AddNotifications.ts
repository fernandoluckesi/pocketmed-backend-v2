import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddNotifications1763000000000 implements MigrationInterface {
  name = 'AddNotifications1763000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'notifications',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          { name: 'user_id', type: 'varchar', length: '36', isNullable: false },
          { name: 'user_type', type: 'varchar', length: '20', isNullable: false },
          { name: 'type', type: 'varchar', length: '60', isNullable: false },
          { name: 'title', type: 'varchar', length: '255', isNullable: false },
          { name: 'body', type: 'text', isNullable: false },
          { name: 'data', type: 'json', isNullable: true },
          {
            name: 'related_entity_id',
            type: 'varchar',
            length: '36',
            isNullable: true,
          },
          { name: 'is_read', type: 'tinyint', width: 1, default: 0 },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        indices: [
          {
            name: 'IDX_notifications_user',
            columnNames: ['user_id', 'user_type'],
          },
          {
            name: 'IDX_notifications_user_unread',
            columnNames: ['user_id', 'is_read'],
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('notifications');
  }
}
