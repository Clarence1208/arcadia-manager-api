import { CreateUserDto } from "./create-user.dto";
import { ListAllEntities } from "./list-users.dto";
import { BadRequestException } from "@nestjs/common";
import { LoginUserDto } from "./login-user.dto";

export class UsersValidator {
  static validateLoginUserDto(loginUserDto: LoginUserDto) {
    if (!loginUserDto.email || !loginUserDto.password) {
      throw new BadRequestException(`Missing field email or password`);
    }
  }
  static validateCreateUserDto(createUserDto: CreateUserDto) {
    if (!createUserDto.surname) {
      throw new Error("Surname is required");
    }
    if (!createUserDto.firstName) {
      throw new Error("First Name is required");
    }
    if (!createUserDto.email) {
      throw new Error("Email is required");
    }
    if (!createUserDto.password) {
      throw new Error("Password must be present");
    }
    if (createUserDto.password.length < 8) {
      throw new Error("8 characters minimum required for password.");
    }
    if (!createUserDto.roles) {
      createUserDto.roles = "user";
    } else if (
      createUserDto.roles !== "user" &&
      createUserDto.roles !== "admin" &&
      createUserDto.roles !== "superadmin"
    ) {
      throw new Error("Role unknown");
    }
  }

  static validateListEntities(listAllEntities: ListAllEntities) {
    if (listAllEntities.page <= 0) {
      throw new Error("Page must be greater than 0");
    }
  }
}
