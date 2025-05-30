import { CreateWebsiteDto } from "./create-website-dto";
import { BadRequestException } from "@nestjs/common";
import { ListWebsitesDto } from "./list-websites.dto";
export class WebsitesValidator {
  static validateWebsiteDto(createWebsiteDTO: CreateWebsiteDto) {
    if (!createWebsiteDTO.url) {
      throw new BadRequestException("Surname is required");
    }
    if (!createWebsiteDTO.dbUsername) {
      throw new BadRequestException("Username is required");
    }
    if (!createWebsiteDTO.dbUsername) {
      throw new BadRequestException("Password is required");
    }
    if (createWebsiteDTO.dbPassword.length < 8) {
      throw new BadRequestException(
        "8 characters minimum required for password.",
      );
    }
    if(!createWebsiteDTO.userId){
      throw new BadRequestException("User ID is required");
    }
    if(!createWebsiteDTO.associationName){
      throw new BadRequestException("Association name is required");
    }
  }

  static validateListEntities(listAllEntities: ListWebsitesDto) {
    if (listAllEntities.page <= 0) {
      throw new BadRequestException("Page must be greater than 0");
    }
  }
}
