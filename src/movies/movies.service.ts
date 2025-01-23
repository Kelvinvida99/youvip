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
import { User } from '../auth/entities/user.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  private readonly logger = new Logger('MoviesService');

  async create(createMovieDto: CreateMovieDto, user: User): Promise<Movie> {
    try {
      const movie = this.movieRepository.create({
        ...createMovieDto,
        user,
      });
      await this.movieRepository.save(movie);

      return movie;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<Movie[]> {
    const { limit = 10, offset = 0 } = paginationDto;

    return await this.movieRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(term: string): Promise<Movie> {
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

  async update(
    id: string,
    updateMovieDto: UpdateMovieDto,
    user: User,
  ): Promise<Movie> {
    const movie = await this.movieRepository.preload({
      id: id,
      ...updateMovieDto,
    });

    if (!movie) throw new NotFoundException(`Movie with id ${id} not found`);

    movie.user = user;

    try {
      await this.movieRepository.save(movie);
      return movie;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string): Promise<boolean> {
    const movie = await this.findOne(id);
    try {
      await this.movieRepository.remove(movie);
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
