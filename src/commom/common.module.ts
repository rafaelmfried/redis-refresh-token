import { Module } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { BcryptService } from './utils/bcrypt.service';

@Module({
  imports: [],
  providers: [HttpExceptionFilter, BcryptService],
  exports: [HttpExceptionFilter, BcryptService],
})
export class CommonModule {}
