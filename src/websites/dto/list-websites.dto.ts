import { ApiProperty } from "@nestjs/swagger";

export class ListWebsitesDto {
  @ApiProperty({
    example: "10",
    required: false,
  })
  limit: number = 10;
  @ApiProperty({
    example: "1",
    required: false,
  })
  page: number = 1;
}
