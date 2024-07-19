import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import * as fs from "node:fs";

async function bootstrap() {

    const httpsOptions = {
        key: fs.readFileSync('/etc/ssl/live/arcadia-solution.com-0002/privkey.pem'),
        cert: fs.readFileSync('/etc/ssl/live/arcadia-solution.com-0002/fullchain.pem'),
    };

    const app = await NestFactory.create(
        AppModule,
        {httpsOptions},
    );

    const config = new DocumentBuilder()
        .setTitle("Arcadia Solutions Manager API")
        .setDescription("The Arcadia Solutions manager API")
        .setVersion("1.0")
        .addBearerAuth(
            {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
                name: "JWT",
                description: "Enter JWT token",
                in: "header",
            },
            "JWT-auth", // This name here is important for matching up with @ApiBearerAuth() in your controller!
        )
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document);

    app.enableCors({
        //Add your origins here
        origin: true,
    });
    await app.listen(3000);

}

bootstrap();
