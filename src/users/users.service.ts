import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt'
import { RegisterDto } from 'auth/dto/register.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }
  async create(data: CreateUserDto) {
    const { password, confirmPassword, email, ...otherData } = data
    if (password !== confirmPassword) {
      throw new BadRequestException("Password does not match")
    }
    const isExists = await this.findByEmail(email)
    if (isExists) {
      throw new BadRequestException("Email already exists")
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await this.prisma.user.create({ data: { password: hashedPassword, email, ...otherData } })
    return {
      message: "User created successfully",
      user: user
    }
  }

  findAll() {
    return this.prisma.user.findMany()
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } })
  }

  update(id: string, data: UpdateUserDto) {
    return this.prisma.user.update({ where: { id }, data })
  }

  remove(id: string) {
    return this.prisma.user.delete({ where: { id } })
  }
  async block(id: string) {
    const user = await this.findOne(id)
    if (!user) {
      throw new NotFoundException("User not found")
    }
    await this.prisma.user.update({
      where: { id },
      data: { status: "blocked" }
    })
    return {
      message: `${user.id}-${user.email} blocked successfully`,
    }
  }
  async unblock(id: string) {
    const user = await this.findOne(id)
    if (!user) {
      throw new NotFoundException("User not found")
    }
    await this.prisma.user.update({
      where: { id },
      data: { status: "active" }
    })
    return {
      message: `${user.id}-${user.email} activated successfully`,
    }
  }
  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } })
  }
  async register(data: RegisterDto) {
    const { password, confirmPassword, email } = data
    if (password !== confirmPassword) {
      throw new BadRequestException("Password does not match")
    }
    const isExists = await this.findByEmail(email)
    if (isExists) {
      throw new BadRequestException("User with given email already exists")
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      }
    })
    return {
      message: "User registered successfully",
      user: newUser
    }
  }
  async editLastLogin(id: string, loginTime: string) {
    const user = await this.findOne(id)
    if (!user) {
      throw new NotFoundException("User not found")
    }
    await this.prisma.user.update({
      where: { id },
      data: { lastLogin: loginTime }
    })
    return {
      message: `${user.id}-${user.lastLogin} activated successfully`,
    }
  }

}
