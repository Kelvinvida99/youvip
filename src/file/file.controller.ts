import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('movie')
  @UseInterceptors(FileInterceptor('file'))
  uploaMovieImage(@UploadedFile() file: Express.Multer.File) {
    return file;
  }
}
