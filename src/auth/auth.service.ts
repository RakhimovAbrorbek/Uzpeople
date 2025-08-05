import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from 'users/dto/create-user.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService,
    private jwtService: JwtService
  ) { }


  async login(data: SignInDto) {
    const { email, password } = data
    const user = await this.userService.findByEmail(email)
    if (!user) {
      throw new NotFoundException("User not found")
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      throw new BadRequestException("Email or password is wrong")
    }
    if (user.status !== "active") {
      throw new BadRequestException("User blocked ")
    }
    const payload = { id: user.id, email: user.email, role: user.role }
    const token = this.jwtService.sign(payload)
    return {
      message: `Welcome ${user.name}`,
      access_token: token,
      role: user.role,
      id: user.id
    }
  }

  async register(data: RegisterDto) {
    return this.userService.register(data)
  }
}
