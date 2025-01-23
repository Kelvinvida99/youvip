import { User } from '../../auth/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('series')
export class Series {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  title: string;

  @Column('text')
  description: string;

  @Column('text', {
    array: true,
    default: [],
  })
  seriesUrl: string[];

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

  /*   @Column('int', {
    default: 0,
  })
  totalSeasons: number; */

  @Column('int', {
    default: 0,
  })
  totalEpisodes: number;

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
  creators: string[];

  @Column('text', {
    array: true,
    default: [],
  })
  writers: string[];

  @ManyToOne(() => User, (user) => user.series, { eager: true })
  user: User;
}
