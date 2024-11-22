import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AppCacheModule } from 'src/cache/cache.module';
import { BcryptService } from 'src/commom/utils/bcrypt.service';
import { UsersService } from 'src/users/users.service';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/users.module';
import { CommonModule } from 'src/commom/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    UsersModule,
    forwardRef(() => CommonModule),
    TypeOrmModule.forFeature([User]),
    DatabaseModule,
    JwtModule.register({
      global: true,
    }),
    AppCacheModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, BcryptService, UsersService, AuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
