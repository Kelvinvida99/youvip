import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Movie {
  @PrimaryColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  title: string;
}
