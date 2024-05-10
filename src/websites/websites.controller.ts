import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  SetMetadata,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { WebsitesService } from "./websites.service";
import { CreateWebsiteDto } from "./dto/create-website-dto";
import { ListWebsitesDto } from "./dto/list-websites.dto";
import { Website } from "./website.entity";
import { UpdateWebsiteDto } from "./dto/update-website.dto";
import { Role } from "../roles/roles.enum";
import { Roles } from "../roles/roles.decorator";

export const CAN_SKIP_AUTH_KEY = "isPublic";
export const SkipAuthentication = () => SetMetadata(CAN_SKIP_AUTH_KEY, true);

@ApiTags("Websites")
@Controller("websites")
@ApiBearerAuth("JWT-auth")
export class WebsitesController {
  constructor(private readonly websitesServices: WebsitesService) {}
  @Post("")
  @SkipAuthentication() //Allow user to do this without already being logged in (smert)
  @ApiResponse({
    status: 201,
    description: "The website has been successfully created.",
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
  })
  @ApiBody({
    type: CreateWebsiteDto,
    description: "Json structure for create websites object",
  })
  async create(@Body() createWebsiteDTO) {
    return this.websitesServices.create(createWebsiteDTO);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: "The websites has been successfully fetched.",
  })
  async findAll(@Query() query: ListWebsitesDto): Promise<Website[]> {
    return this.websitesServices.findAll(query.limit, query.page, query.userId);
  }

  @Get(":id")
  @ApiResponse({
    status: 200,
    description: "The user has been successfully fetched.",
  })
  async findOne(@Param("id") id: number): Promise<Website> {
    return this.websitesServices.findOne(id);
  }

  @Patch(":id")
  @ApiResponse({
    status: 200,
    description: "The user has been successfully updated.",
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
  })
  async update(
    @Param("id") id: number,
    @Body() updateWebsiteDTO: UpdateWebsiteDto,
  ): Promise<Website> {
    return this.websitesServices.update(id, updateWebsiteDTO);
  }

  @Delete(":id")
  @ApiResponse({
    status: 200,
    description: "The user has been successfully deleted.",
  })
  @ApiResponse({
    status: 404,
    description: "User not found",
  })
  async remove(@Param("id") id: number): Promise<Website> {
    return this.websitesServices.remove(id);
  }
}
