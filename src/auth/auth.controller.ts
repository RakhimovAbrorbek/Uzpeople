import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('session')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("login")
  login(@Body() signInDto: SignInDto) {
    return this.authService.login(signInDto)
  }
  @Post("register")
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }
}
