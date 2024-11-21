import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UsersService } from 'src/users/users.service';
import { CacheService } from 'src/cache/cache.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly redisCache: CacheService,
  ) {}

  async signIn(loginAuthDto: LoginAuthDto) {
    const user = await this.userService.findOneByUsername(
      loginAuthDto.username,
    );

    if (!user) throw new UnauthorizedException();

    const { email, username, id } = user;
    const payload = { username, email, id };
    const token = {
      access_token: await this.jwtService.signAsync(payload),
    };
    await this.redisCache.storeToken(token.access_token);
    return token;
  }
}
