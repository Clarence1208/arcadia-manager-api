import { ApiProperty } from "@nestjs/swagger";

import { IsDate, IsEmail, IsString, MinLength } from "class-validator";
import {User} from "../../users/user.entity";

export class CreateWebsiteDto {
  @ApiProperty({
    example: "monasso",
    required: true,
  })
  @IsString()
  url: string;

  @ApiProperty({
    example: "DatabaseAdminUsername",
    required: true,
  })
  @IsString()
  dbUsername: string;

  @ApiProperty({
    example: "DatabaseAdminPassword",
    required: true,
  })
  @IsString()
  dbPassword: string;

  @ApiProperty({
    example: "1",
    required: true,
  })
  userId: number;

  @ApiProperty({
    example: "Goupix",
    required: true,
  })
  @IsString()
  associationName: string;

  user: User;
}
