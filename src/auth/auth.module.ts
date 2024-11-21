import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AppCacheModule } from 'src/cache/cache.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY || 'chave',
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
    AppCacheModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
