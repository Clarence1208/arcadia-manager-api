import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { UsersController } from "./users/users.controller";
import { UsersService } from "./users/users.service";
import { User } from "./users/user.entity";

import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./auth/auth.guard";
import { RolesGuard } from "./roles/roles.guard";
import { Website } from "./websites/website.entity";
import { WebsitesController } from "./websites/websites.controller";
import { WebsitesService } from "./websites/websites.service";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "arcadia-manager-mysql-db",
      port: 3306,
      username: process.env.DATABASE_ROOT,
      password: process.env.DATABASE_ROOT_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, Website],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Website]),
  ],
  controllers: [AppController, UsersController, WebsitesController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AppService,
    UsersService,
    WebsitesService,
  ],
})
export class AppModule {}
