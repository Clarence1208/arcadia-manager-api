import { ApiProperty } from "@nestjs/swagger";

export class ListAllEntities {
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
