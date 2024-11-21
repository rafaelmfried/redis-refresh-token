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
    const user = await this.userService.findOneByUsername(
      loginAuthDto.username,
    );

    if (!user) throw new UnauthorizedException();

    const { password: hashPassword, ...payload } = user;

    const isValidToken = await this.bcryptService.comparePassword(
      loginAuthDto.password,
      hashPassword,
    );

    if (!isValidToken) throw new UnauthorizedException();

    const access_token = await this.jwtService.signAsync(payload);
    const refresh_token = await this.jwtService.signAsync(payload);
    await this.redisCache.storeToken(refresh_token);
    return { access_token };
  }
}
