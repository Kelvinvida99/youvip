import { existsSync } from 'fs';
import { join } from 'path';

import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileService {
  getStaticMoviePost(imageName: string) {
    const path = join(__dirname, '../../static/posts', imageName);

    if (!existsSync(path))
      throw new BadRequestException(`No post found with image ${imageName}`);

    return path;
  }
}
