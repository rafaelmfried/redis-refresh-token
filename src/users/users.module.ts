import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsernameExistsValidator } from 'src/commom/validators/username-exists.validator';
// import { CommonModule } from 'src/commom/common.module';
// import { forwardRef } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    //forwardRef(() => CommonModule)],
  ],
  controllers: [UsersController],
  providers: [UsersService, UsernameExistsValidator],
  exports: [UsersService],
})
export class UsersModule {}
