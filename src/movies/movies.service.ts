import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  private readonly logger = new Logger('ProductsService');

  async create(createMovieDto: CreateMovieDto) {
    try {
      const movie = this.movieRepository.create(createMovieDto);
      await this.movieRepository.save(movie);

      return movie;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return this.movieRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(term: string) {
    console.log(term);
    let movie: Movie;

    if (isUUID(term)) {
      movie = await this.movieRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.movieRepository.createQueryBuilder();
      movie = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {
          title: term.toUpperCase(),
        })
        .getOne();
    }

    if (!movie) throw new NotFoundException(`Movie with ${term} not found`);

    return movie;
  }

  async update(id: string, updateMovieDto: UpdateMovieDto) {
    const movie = await this.movieRepository.preload({
      id: id,
      ...updateMovieDto,
    });

    if (!movie) throw new NotFoundException(`Movie with id ${id} not found`);

    try {
      await this.movieRepository.save(movie);
      return movie;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const movie = await this.findOne(id);
    await this.movieRepository.remove(movie);
    return true;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    // console.log(error)
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
