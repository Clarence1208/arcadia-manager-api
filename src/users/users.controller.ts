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
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { ListAllEntities } from "./dto/list-users.dto";
import { User, UserWithoutPassword } from "./user.entity";
import { UpdateUserDto } from "./dto/update-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { LogoutUserDto } from "./dto/logout-user.dto";
import { Role } from "../roles/roles.enum";
import { Roles } from "../roles/roles.decorator";

export const CAN_SKIP_AUTH_KEY = "isPublic";
export const SkipAuthentication = () => SetMetadata(CAN_SKIP_AUTH_KEY, true);

@ApiTags("Users")
@Controller("users")
@ApiBearerAuth("JWT-auth")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post("register")
  @SkipAuthentication() //Allow user to do this without already being logged in (smert)
  @ApiResponse({
    status: 201,
    description: "The user has been successfully created.",
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
  })
  @ApiBody({
    type: CreateUserDto,
    description: "Json structure for create user object",
  })
  async create(@Body() createUserDTO: CreateUserDto) {
    return this.usersService.create(createUserDTO);
  }

  @Post("login")
  @SkipAuthentication()
  @ApiResponse({
    status: 200,
    description: "The user has been successfully logged in.",
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
  })
  @ApiBody({
    type: LoginUserDto,
    description: "Json structure for login user object",
  })
  async login(@Body() loginUserDTO: LoginUserDto) {
    return this.usersService.login(loginUserDTO);
  }
  @Post("logout")
  @ApiResponse({
    status: 200,
    description: "The user has been successfully logged out.",
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
  })
  @ApiBody({
    type: LogoutUserDto,
    description: "Json structure for logout user object",
  })
  async logout(@Body() authToken: LogoutUserDto) {
    return this.usersService.logout(authToken);
  }

  @Get()
  @Roles([Role.SuperAdmin])
  @ApiResponse({
    status: 200,
    description: "The users has been successfully fetched.",
  })
  async findAll(@Query() query: ListAllEntities): Promise<User[]> {
    return this.usersService.findAll(query.limit, query.page);
  }

  @Get(":id")
  @ApiResponse({
    status: 200,
    description: "The user has been successfully fetched.",
  })
  async findOne(@Param("id") id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Get(":id/withoutPassword")
  @ApiResponse({
    status: 200,
    description: "The user has been successfully fetched.",
  })
  async findOneWithoutPassword(@Param("id") id: number): Promise<UserWithoutPassword> {
    return this.usersService.findOneWithoutPassword(id);
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
    @Body() updateMovieDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateMovieDto);
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
  async remove(@Param("id") id: number): Promise<User> {
    return this.usersService.remove(id);
  }
}
