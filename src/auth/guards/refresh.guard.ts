import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CacheService } from 'src/cache/cache.service';
import { AuthService } from '../auth.service';

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly redisCache: CacheService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const refresh_token = this.extractTokenFromHeader(request);
    if (!refresh_token)
      throw new UnauthorizedException('Usuario não autenticado');

    const redisToken = await this.redisCache.retrieveToken(refresh_token);

    if (!redisToken) throw new UnauthorizedException('Refresh token invalido');

    const decoded = await this.authService.verifyRefreshToken(refresh_token);

    if (!decoded)
      throw new UnauthorizedException('Erro ao verificar refresh token');

    const { id, username, email } = decoded;

    const payload = { id, username, email };

    const accessToken = await this.authService.generateAccessToken(payload);
    const refreshToken = await this.authService.generateRefreshToken(payload);
    // Gerou um novo deletamos o antigo do redis, caso não iremos manter o antigo e devemos deletar o novo.
    if (refreshToken) this.redisCache.deleteToken(refresh_token);

    request.user = payload;

    response.json({ access_token: accessToken, refresh_token: refreshToken });

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
