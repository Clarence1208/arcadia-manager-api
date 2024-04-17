import { IsDate, IsEmail, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
  @ApiProperty({
    example: "HIRSCH",
    required: false,
  })
  @IsString()
  surname?: string;

  @ApiProperty({
    example: "Clarence",
    required: false,
  })
  @IsString()
  firstName?: string;

  @ApiProperty({
    example: "nplhch@myges.fr",
    required: false,
  })
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: "SUP3R_S3CR3T_UPDATED!!",
    required: false,
  })
  @IsString()
  @MinLength(8)
  password?: string;

  @ApiProperty({
    example: "user",
    required: false,
  })
  roles?: string;

  @ApiProperty({
    example: 1,
    required: false,
  })
  websiteID?: number;
}
