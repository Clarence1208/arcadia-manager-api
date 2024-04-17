import { ApiProperty } from "@nestjs/swagger";

import { IsDate, IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @ApiProperty({
    example: "HIRSCH",
    required: true,
  })
  @IsString()
  surname: string;

  @ApiProperty({
    example: "Clarence",
    required: true,
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    example: "nplhch@myges.fr",
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "SUP3R_S3CR3T!!",
    required: true,
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    example: "user",
    required: false,
  })
  roles?: string;
}
