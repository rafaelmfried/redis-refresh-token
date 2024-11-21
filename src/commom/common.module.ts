import { forwardRef, Module } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { UsernameExistsValidator } from './validators/username-exists.validator';
import { BcryptService } from './utils/bcrypt.service';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [forwardRef(() => UsersModule), TypeOrmModule.forFeature([User])],
  providers: [
    UsersService,
    UsernameExistsValidator,
    HttpExceptionFilter,
    BcryptService,
  ],
  exports: [HttpExceptionFilter, UsernameExistsValidator, BcryptService],
})
export class CommonModule {}
