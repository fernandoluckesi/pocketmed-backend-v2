import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ExamCatalogService } from './exam-catalog.service';
import { ListExamCatalogQueryDto } from './dto/list-exam-catalog.query.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Exam Catalog')
@Controller('exam-catalog')
export class ExamCatalogController {
  constructor(private readonly examCatalogService: ExamCatalogService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'List exam catalog with optional search and category filter' })
  @ApiResponse({ status: 200, description: 'Returns paginated list of exams' })
  async findAll(@Query() query: ListExamCatalogQueryDto) {
    return this.examCatalogService.findAll(query);
  }

  @Get('categories')
  @Public()
  @ApiOperation({ summary: 'List all exam categories' })
  @ApiResponse({ status: 200, description: 'Returns all exam categories' })
  async findAllCategories() {
    return this.examCatalogService.findAllCategories();
  }
}
