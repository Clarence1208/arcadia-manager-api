import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import {SkipAuthentication} from "./users/users.controller";
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @SkipAuthentication()
  getPresentation(): string {
    return this.appService.getPresentation();
  }
}
