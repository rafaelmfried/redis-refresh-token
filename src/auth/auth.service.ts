import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UsersService } from 'src/users/users.service';
import { CacheService } from 'src/cache/cache.service';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from 'src/commom/utils/bcrypt.service';
import { IUserPayload } from './dto/user-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly redisCache: CacheService,
    private readonly bcryptService: BcryptService,
  ) {}

  async signIn(
    credential: LoginAuthDto,
  ): Promise<{ access_token?: string; refresh_token?: string }> {
    try {
      const user = await this.userService.findOneByUsername(
        credential.username,
      );

      if (!user) throw new UnauthorizedException('Invalid user');

      const { password: hashPassword, ...payload } = user;

      const isValidPassword = await this.bcryptService.comparePassword(
        credential.password,
        hashPassword,
      );

      if (!isValidPassword) throw new UnauthorizedException('Wrong password');

      const access_token = await this.generateAccessToken(payload);
      const refresh_token = await this.generateRefreshToken(payload);

      return { access_token, refresh_token };
    } catch (error) {
      throw new HttpException('Internal Error', 500);
    }
  }

  async verifyAccessToken(token: string): Promise<IUserPayload> {
    try {
      const decoded: IUserPayload = await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET_KEY,
      });
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Access token inválido');
    }
  }

  async verifyRefreshToken(token: string) {
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido');
    }
  }

  async generateRefreshToken(payload: IUserPayload): Promise<string> {
    try {
      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: process.env.EXPIRESIN_REFRESH_TOKEN,
      });

      const isCachedToken = await this.redisCache.storeToken(refreshToken);

      if (!isCachedToken)
        throw new InternalServerErrorException(
          'Erro para salvar refresh token',
        );

      return refreshToken;
    } catch (error) {
      throw new HttpException('Erro ao gerar refresh token', 500);
    }
  }

  async generateAccessToken(payload: IUserPayload) {
    try {
      return await this.jwtService.signAsync(payload, {
        secret: process.env.SECRET_KEY,
        expiresIn: process.env.EXPIRESIN_ACCESS_TOKEN,
      });
    } catch (error) {
      throw new HttpException('Erro ao gerar access token', 500);
    }
  }
}
