import { IsDate, IsEmail, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateWebsiteDto {
  @ApiProperty({
    example: "DOWN",
    required: false,
  })
  @IsString()
  status?: string;
}
