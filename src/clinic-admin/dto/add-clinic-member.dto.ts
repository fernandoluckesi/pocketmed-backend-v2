import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ProfessionalRole } from '../../auth/professional-role.enum';

export class AddClinicMemberDto {
  @ApiProperty({ example: 'doctor@example.com', required: false })
  @IsOptional()
  @IsEmail()
  professionalEmail?: string;

  @ApiProperty({ example: '42f4b84a-6e0f-4328-a2f7-99985d0f7487', required: false })
  @IsOptional()
  @IsUUID('4')
  professionalId?: string;

  @ApiProperty({ enum: ProfessionalRole, example: ProfessionalRole.DOCTOR })
  @IsEnum(ProfessionalRole)
  role: ProfessionalRole;

  @ApiProperty({ example: 'Ana Souza', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name?: string;

  @ApiProperty({ example: 'secretaria@clinica.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '11999998888', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;
}
