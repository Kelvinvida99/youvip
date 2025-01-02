import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsDate,
  IsOptional,
  IsUrl,
  IsNumber,
  Min,
  Max,
  ArrayNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMovieDto {
  /* @IsUUID()
  @IsNotEmpty()
  id: string; */

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUrl()
  @IsNotEmpty()
  movieUrl: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  genre: string[];

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  releaseDate: Date;

  @IsNumber()
  @Min(0)
  @Max(10)
  rating: number;

  @IsNumber()
  @Min(0)
  runtime: number; // in minutes

  @IsOptional()
  @IsUrl()
  posterUrl?: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  cast: string[];

  @IsArray()
  @IsString({ each: true })
  directors: string[];

  @IsArray()
  @IsString({ each: true })
  writers: string[];
}
