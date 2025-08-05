import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string
  @IsNotEmpty()
  @IsEmail()
  email: string
  @IsString()
  @IsNotEmpty()
  password: string
  @IsString()
  @IsNotEmpty()
  confirmPassword: string
  @IsNotEmpty()
  role: string
}
