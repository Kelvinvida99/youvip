import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { SeriesService } from './series.service';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { GetUser } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interface';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('series')
@Auth(ValidRoles.admin)
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @Post()
  create(@Body() createSeriesDto: CreateSeriesDto, @GetUser() user: User) {
    return this.seriesService.create(createSeriesDto, user);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.seriesService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.seriesService.findOne(term);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSeriesDto: UpdateSeriesDto,
    @GetUser() user: User,
  ) {
    return this.seriesService.update(id, updateSeriesDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.seriesService.remove(id);
  }
}
