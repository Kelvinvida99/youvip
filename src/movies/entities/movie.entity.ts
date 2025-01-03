import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  title: string;

  @Column('text')
  description: string;

  @Column('text')
  movieUrl: string;

  @Column('text', {
    array: true,
    default: [],
  })
  genre: string[];

  @Column('date')
  releaseDate: Date;

  @Column('float', {
    default: 0,
  })
  rating: number;

  @Column('int', {
    default: 0,
  })
  runtime: number; // in minutes

  @Column('text', {
    nullable: true,
  })
  posterUrl: string;

  @Column('text', {
    array: true,
    default: [],
  })
  cast: string[];

  @Column('text', {
    array: true,
    default: [],
  })
  directors: string[];

  @Column('text', {
    array: true,
    default: [],
  })
  writers: string[];
}
