import { ApiProperty } from "@nestjs/swagger";

import { IsDate, IsEmail, IsString, MinLength } from "class-validator";

export class CreateWebsiteDto {
  @ApiProperty({
    example: "monasso.arcadia-solutions.com",
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
}
