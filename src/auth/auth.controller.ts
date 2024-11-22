import {
  Controller,
  Post,
  Body,
  Get,
  HttpCode,
  HttpStatus,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() loginAuthDto: LoginAuthDto) {
    return await this.authService.signIn(loginAuthDto);
  }

  @Get()
  async signOut() {}

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() request) {
    console.log(request.user);
    return request.user;
  }
}
