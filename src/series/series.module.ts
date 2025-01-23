import { Module } from '@nestjs/common';
import { SeriesService } from './series.service';
import { SeriesController } from './series.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Series } from './entities/series.entity';

@Module({
  controllers: [SeriesController],
  providers: [SeriesService],
  imports: [TypeOrmModule.forFeature([Series]), AuthModule],
})
export class SeriesModule {}
