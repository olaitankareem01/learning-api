import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsIn } from 'class-validator';

export class SignUpDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;


  @ApiProperty({ example: 'john' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'doe' })
  @IsString()
  @MinLength(6)
  lastName: string;

  @ApiProperty()
  @IsString()
  roleId: string;
}

export class SignInDto {
  @ApiProperty({ example: 'learning@yopmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Learning2025!' })
  @IsString()
  @MinLength(6)
  password: string;
}
