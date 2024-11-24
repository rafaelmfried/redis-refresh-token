import {
  Controller,
  Post,
  Body,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Request } from 'express';

import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { RefreshGuard } from './guards/refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(@Body() loginAuthDto: LoginAuthDto) {
    return await this.authService.signIn(loginAuthDto);
  }

  @UseGuards(RefreshGuard)
  @Get('refresh')
  async RefreshToken() {}

  @Get()
  async signOut() {}

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(
    @Req()
    request: Request,
  ) {
    return request.user;
  }
}
