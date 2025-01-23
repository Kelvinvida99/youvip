import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { Series } from './entities/series.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class SeriesService {
  constructor(
    @InjectRepository(Series)
    private readonly seriesRepository: Repository<Series>,
  ) {}

  private readonly logger = new Logger('SeriesService');

  async create(createSeriesDto: CreateSeriesDto, user: User): Promise<Series> {
    try {
      const serie = this.seriesRepository.create({
        ...createSeriesDto,
        user,
      });
      await this.seriesRepository.save(serie);

      return serie;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<Series[]> {
    const { limit = 10, offset = 0 } = paginationDto;

    return await this.seriesRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(term: string): Promise<Series> {
    let serie: Series;

    if (isUUID(term)) {
      serie = await this.seriesRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.seriesRepository.createQueryBuilder();
      serie = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {
          title: term.toUpperCase(),
        })
        .getOne();
    }

    if (!serie) throw new NotFoundException(`Serie with ${term} not found`);

    return serie;
  }

  async update(
    id: string,
    updateSeriesDto: UpdateSeriesDto,
    user: User,
  ): Promise<Series> {
    const serie = await this.seriesRepository.preload({
      id,
      ...updateSeriesDto,
    });

    if (!serie) throw new NotFoundException(`Serie with id ${id} not found`);

    serie.user = user;

    try {
      await this.seriesRepository.save(serie);
      return serie;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string): Promise<boolean> {
    const serie = await this.findOne(id);
    try {
      await this.seriesRepository.remove(serie);
    } catch (error) {
      this.handleDBExceptions(error);
    }
    return true;
  }

  private handleDBExceptions(error: any): void {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    // console.log(error)
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
