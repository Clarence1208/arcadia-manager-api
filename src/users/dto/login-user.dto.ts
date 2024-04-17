import { ApiProperty } from "@nestjs/swagger";

import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginUserDto {
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
}
