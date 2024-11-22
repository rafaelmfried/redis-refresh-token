import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CommonModule } from 'src/commom/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BcryptService } from 'src/commom/utils/bcrypt.service';
import { UsernameExistsValidator } from '../commom/validators/username-exists.validator';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => CommonModule)],
  controllers: [UsersController],
  providers: [UsersService, BcryptService, UsernameExistsValidator],
  exports: [UsersService],
})
export class UsersModule {}
