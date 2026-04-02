import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login user and get JWT token' })
  @ApiBody({ type: AuthLoginDto })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: AuthRegisterDto })
  @ApiResponse({ status: 201, description: 'User created' })
  async register(@Body() body: AuthRegisterDto) {
    const { username, password } = body;
    return await this.authService.register(username, password);
  }
}
