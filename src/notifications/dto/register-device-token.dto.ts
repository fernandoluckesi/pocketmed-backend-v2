import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn, IsOptional } from 'class-validator';

export class RegisterDeviceTokenDto {
  @ApiProperty({ example: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]' })
  @IsString()
  expoPushToken: string;

  @ApiProperty({ example: 'ios', required: false })
  @IsOptional()
  @IsIn(['ios', 'android', 'unknown'])
  platform?: string;
}
