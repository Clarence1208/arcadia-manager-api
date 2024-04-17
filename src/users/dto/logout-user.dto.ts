import { ApiProperty } from "@nestjs/swagger";

import { IsEmail, IsString, MinLength } from "class-validator";

export class LogoutUserDto {
  @ApiProperty({
    example: "bieziubvosiuhwdivf/vfçerqbj81720duebqo",
    required: true,
  })
  @IsEmail()
  authToken: string;
}
