import { IsDate, IsEmail, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateWebsiteDto {
  @ApiProperty({
    example: "inactive",
    required: false,
  })
  @IsString()
  status?: string;
}
