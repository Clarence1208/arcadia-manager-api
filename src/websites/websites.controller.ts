import {Body, Controller, Delete, Get, Param, Patch, Post, Query, SetMetadata,} from "@nestjs/common";
import {ApiBearerAuth, ApiBody, ApiResponse, ApiTags} from "@nestjs/swagger";
import {ScriptDTO, WebsitesService} from "./websites.service";
import {CreateWebsiteDto} from "./dto/create-website-dto";
import {ListWebsitesDto} from "./dto/list-websites.dto";
import {Website} from "./website.entity";
import {UpdateWebsiteDto} from "./dto/update-website.dto";

export const CAN_SKIP_AUTH_KEY = "isPublic";
export const SkipAuthentication = () => SetMetadata(CAN_SKIP_AUTH_KEY, true);

@ApiTags("Websites")
@Controller("websites")
@ApiBearerAuth("JWT-auth")
export class WebsitesController {
    constructor(private readonly websitesServices: WebsitesService) {
    }

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
    async create(@Body() createWebsiteDTO: CreateWebsiteDto) {
        return this.websitesServices.create(createWebsiteDTO);
    }

    @Get("")
    @SkipAuthentication()
    @ApiResponse({
        status: 200,
        description: "The websites has been successfully fetched.",
    })
    async findAll(@Query() query: ListWebsitesDto): Promise<Website[]> {
        return this.websitesServices.findAll(query.limit, query.page, query.userId);
    }

    @Get(":id")
    @SkipAuthentication()
    @ApiResponse({
        status: 200,
        description: "The websites has been successfully fetched.",
    })
    async findOne(@Param("id") id: number): Promise<Website> {
        return this.websitesServices.findOne(id);
    }

    @Patch(":id")
    @ApiResponse({
        status: 200,
        description: "The website has been successfully updated.",
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
        description: "The website has been successfully deleted.",
    })
    @ApiResponse({
        status: 404,
        description: "Website not found",
    })
    async remove(@Param("id") id: number): Promise<Website> {
        return this.websitesServices.remove(id);
    }


    @Post("scripts/domain")
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
        type: ScriptDTO,
        description: "Json structure for create websites object",
    })
    async createDomain(@Body() params: ScriptDTO) {
        const result = await this.websitesServices.deploySubdomain(params);
        return result;
    }

    @Post("scripts/confNginx")
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
        type: ScriptDTO,
        description: "Json structure for create websites object",
    })
    async createConfNginx(@Body() params: ScriptDTO) {
        const result = await this.websitesServices.deployNginxConf(params);
        return result;
    }

    @Post("scripts/frontDocker")
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
        type: ScriptDTO,
        description: "Json structure for create websites object",
    })
    async createFrontEndDOcker(@Body() params: ScriptDTO) {
        const result = await this.websitesServices.deployFrontendDocker(params);
        return result;
    }

    @Post("scripts/apiDocker")
    @SkipAuthentication()
    @ApiResponse({
        status: 201,
        description: "The website has been successfully created.",
    })
    @ApiResponse({
        status: 400,
        description: "Bad request",
    })
    @ApiBody({
        type: ScriptDTO,
        description: "Json structure for create websites object",
    })
    async createAPIdocker(@Body() params: ScriptDTO) {
        const result = await this.websitesServices.deployAPIdocker(params);
        return result;
    }


}
