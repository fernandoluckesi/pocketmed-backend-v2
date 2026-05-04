import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID, ArrayMinSize, IsDateString } from 'class-validator';

export class CreateExamScheduleDto {
  @ApiProperty({
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '223e4567-e89b-12d3-a456-426614174001',
    ],
    description: 'List of exam catalog IDs to schedule (at least one required)',
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('all', { each: true })
  examIds: string[];

  @ApiProperty({
    example: '2024-06-15T09:00:00.000Z',
    description: 'Scheduled date and time in ISO 8601 format',
  })
  @IsDateString()
  scheduledDateTime: string;
}
