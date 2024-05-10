import { ApiProperty } from "@nestjs/swagger";

export class ListWebsitesDto {
  @ApiProperty({
    example: "10",
    required: false,
  })
  limit: number;
  @ApiProperty({
    example: "1",
    required: false,
  })
  page: number;

  @ApiProperty({
    example: "1",
    required: false,
  })
  userId: number;
}
