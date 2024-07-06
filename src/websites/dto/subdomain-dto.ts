import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SubdomainDTO {
  @ApiProperty({
    example: "foo",
    required: false,
  })
  @IsString()
  subdomain?: string;
}
