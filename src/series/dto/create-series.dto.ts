import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateSeriesDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsString({ each: true })
  seriesUrl: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  genre?: string[];

  @IsDateString()
  @IsNotEmpty()
  releaseDate: Date;

  @IsNumber()
  @Min(0)
  @Max(10)
  @IsOptional()
  rating?: number;

  /*   @IsNumber()
  @Min(0)
  @IsOptional()
  totalSeasons?: number; */

  @IsNumber()
  @Min(0)
  @IsOptional()
  totalEpisodes?: number;

  @IsString()
  @IsOptional()
  posterUrl?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  cast?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  creators?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  writers?: string[];
}
