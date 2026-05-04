import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ExamSchedulingService } from './exam-scheduling.service';
import { CreateExamScheduleDto } from './dto/create-exam-schedule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Exam Scheduling')
@Controller('exam-schedules')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('patient')
@ApiBearerAuth('JWT-auth')
export class ExamSchedulingController {
  constructor(private readonly examSchedulingService: ExamSchedulingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new exam schedule for the authenticated patient' })
  @ApiResponse({ status: 201, description: 'Exam schedule created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request — empty exam list or past date' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@CurrentUser() user: any, @Body() dto: CreateExamScheduleDto) {
    return this.examSchedulingService.create(user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all exam schedules for the authenticated patient' })
  @ApiResponse({ status: 200, description: 'Returns list of exam schedules' })
  async findAll(@CurrentUser() user: any) {
    return this.examSchedulingService.findAllByPatient(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single exam schedule by id' })
  @ApiResponse({ status: 200, description: 'Returns the exam schedule' })
  @ApiResponse({ status: 400, description: 'Not found or forbidden' })
  async findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.examSchedulingService.findOneByPatient(id, user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update status or scheduledDateTime of an exam schedule' })
  @ApiResponse({ status: 200, description: 'Updated successfully' })
  async update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() body: { status?: string; scheduledDateTime?: string },
  ) {
    return this.examSchedulingService.update(id, user.userId, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an exam schedule' })
  @ApiResponse({ status: 204, description: 'Deleted successfully' })
  async remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.examSchedulingService.remove(id, user.userId);
  }
}
