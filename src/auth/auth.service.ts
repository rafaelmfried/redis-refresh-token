import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UsersService } from 'src/users/users.service';
import { CacheService } from 'src/cache/cache.service';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from 'src/commom/utils/bcrypt.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly redisCache: CacheService,
    private readonly bcryptService: BcryptService,
  ) {}

  async signIn(loginAuthDto: LoginAuthDto) {
    try {
      const user = await this.userService.findOneByUsername(
        loginAuthDto.username,
      );

      if (!user)
        throw new UnauthorizedException('Problemas nas credenciais fornecidas');

      const { password: hashPassword, ...payload } = user;

      const isValidPassword = await this.bcryptService.comparePassword(
        loginAuthDto.password,
        hashPassword,
      );

      if (!isValidPassword)
        throw new UnauthorizedException('Problemas nas credenciais fornecidas');

      const access_token = await this.jwtService.signAsync(payload, {
        secret: process.env.SECRET_KEY,
        expiresIn: '30s',
      });
      const refresh_token = await this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: '180s',
      });
      const resultSave = await this.redisCache.storeToken(refresh_token);
      console.log(resultSave);
      return { access_token, refresh_token };
    } catch (error) {
      throw new UnauthorizedException('Problemas nas credenciais fornecidas');
    }
  }
}
