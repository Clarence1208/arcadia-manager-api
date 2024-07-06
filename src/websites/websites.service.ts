import {BadRequestException, Injectable, InternalServerErrorException, NotFoundException,} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Website} from "./website.entity";
import {CreateWebsiteDto} from "./dto/create-website-dto";
import {UpdateWebsiteDto} from "./dto/update-website.dto";
import {WebsitesValidator} from "./dto/websites.validator";
import {User} from "../users/user.entity";
import {exec} from "child_process";
import * as util from "node:util";
import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";
import { hash, compare } from "bcrypt";
import {scriptSQL} from "../scripts/sql";
const fs = require('fs/promises');

const execProm = util.promisify(exec);

export class ScriptDTO  {
    @ApiProperty({
        example: "Monasso Asossiation",
        required: true,
    })
    @IsString()
    adminEmail: string;

    @ApiProperty({
        example: "HOUSTON",
        required: true,
    })
    @IsString()
    surname: string;

    @ApiProperty({
        example: "Lea",
        required: true,
    })
    @IsString()
    firstName: string;

    @ApiProperty({
        example: "monasso",
        required: true,
    })
    @IsString()
    subDomain: string;

    @ApiProperty({
        example: "password",
        required: true,
    })
    @IsString()
    dbPassword: string;

    @ApiProperty({
        example: "Nom de l'association",
        required: true,
    })
    @IsString()
    associationName: string;

    @ApiProperty({
        example: "Nom du logo",
        required: true,
    })
    @IsString()
    logoName: string;
}

@Injectable()
export class WebsitesService {
    constructor(
        @InjectRepository(Website)
        private websitesRepository: Repository<Website>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {
    }

    async create(website: CreateWebsiteDto): Promise<Website> {
        try {
            WebsitesValidator.validateWebsiteDto(website);
        } catch (error) {
            throw new BadRequestException(error.message);
        }

        const user = await this.usersRepository.findOneBy({id: website.userId});
        if (!user) {
            throw new BadRequestException(`User ${website.userId} not found`);
        }
        website.user = user;

        const otherWebsite = await this.websitesRepository.findOneBy({
            url: website.url,
        });
        if (otherWebsite) {
            throw new BadRequestException(`URL ${website.url} already exists`);
        }

        try {
            return await this.websitesRepository.save(website);
        } catch (error) {
            throw new InternalServerErrorException(
                error.message || "An error occurred while creating the website",
            );
        }
    }

    async update(id: number, params: UpdateWebsiteDto): Promise<Website> {
        await this.findOne(id);
        //TODO: what can we update ?
        await this.websitesRepository.update(id, params);
        return await this.websitesRepository.findOneBy({id});
    }

    async findAll(limit?: number, page?: number, userId?: number): Promise<Website[]> {

        if (!userId) {
            return await this.websitesRepository.find({
                take: limit || 10,
                skip: (page - 1) * limit || 0,
            });
        } else {
            return await this.websitesRepository.find({
                take: limit || 10,
                skip: (page - 1) * limit || 0,
                where: {user: {id: userId}},
            });
        }
    }

    async findOne(id: number): Promise<Website> {
        const website = await this.websitesRepository.findOneBy({id});
        if (!website) {
            throw new NotFoundException(`Website #${id} not found`);
        }
        return website;
    }

    async remove(id: number): Promise<Website> {
        const website = await this.findOne(id);
        await this.websitesRepository.delete(id);
        return website;
    }

    async deploySubdomain(params: ScriptDTO) {
        const scriptPath = `./src/scripts/new-dommain.sh ${params.associationName} ${params.subDomain}`;
        try {
            const {stdout, stderr} = await execProm(`bash ${scriptPath}`);
            console.log(`Script stdout: ${stdout}`);
            if (stderr) {
                console.error(`Script stderr: ${stderr}`);
                return {message: stderr};
            }
            return {message: stdout};
        } catch (error) {
            console.error(`Error executing script: ${error.message}`);
            return {message: error.message};
        }
    }

    async customizeSQL(baseSQL,email, password, associationName, userFirstName, userSurname, userBirthdate, logoName): Promise<string>{
        //hash bcrypt passwords
        const hashedPassword = await hash(password, 10);
        const superAdminPassword = await hash("Respons11", 10);

        //replace values in SQL script
        return baseSQL.replace(/{USER_EMAIL}/g, email)
            .replace(/{USER_FIRST_NAME}/g, userFirstName)
            .replace(/{USER_SURNAME}/g, userSurname)
            .replace(/{USER_BIRTHDATE}/g, userBirthdate)
            .replace(/{USER_PASSWORD}/g, hashedPassword)
            .replace(/{SUPER_ADMIN_PASSWORD}/g, superAdminPassword)
            .replace(/{NOM DE VOTRE ASSOCIATION}/g, associationName)
            .replace(/{LOGO_NAME}/g, logoName)
            .replace(/associationName/g, associationName);
    }
    async deployAPIdocker(params: ScriptDTO) {

        if (!scriptSQL){
            console.error(`No SQL script found`);
            return {message: "No SQL script found"};
        }
        let customScriptSQL = await this.customizeSQL(scriptSQL,params.adminEmail, params.dbPassword, params.associationName, "Admin", "ADMIN", "1990-12-12", params.logoName);
        // Write the customized script to a file
        const filePath = `./src/scripts/api-deploy.sql`;
        await fs.writeFile(filePath, customScriptSQL, (err: { message: any; }) => {
            if (err) {
                console.error(`Error writing file: ${err.message}`);
                return {message: err.message};
            }
            console.log(`File written to ${filePath}`);
        });
        const scriptPath = `./src/scripts/deploy-api.sh ${params.associationName} ${params.subDomain} '${filePath}' `;
        try {
            const {stdout, stderr} = await execProm(`bash ${scriptPath}`);
            console.log(`Script stdout: ${stdout}`);
            if (stderr) {
                console.error(`Script stderr: ${stderr}`);
                return {message: stderr};
            }
            return {message: stdout};
        } catch (error) {
            console.error(`Error executing script: ${error.message}`);
            return {message: error.message};
        }
    }

    async deployFrontendDocker(params: ScriptDTO) {
        const scriptPath = `./src/scripts/deploy-front.sh ${params.associationName} ${params.subDomain}`;
        try {
            const {stdout, stderr} = await execProm(`bash ${scriptPath}`);
            console.log(`Script stdout: ${stdout}`);
            if (stderr) {
                console.error(`Script stderr: ${stderr}`);
                return {message: stderr};
            }
            return {message: stdout};
        } catch (error) {
            console.error(`Error executing script: ${error.message}`);
            return {message: error.message};
        }
    }

    async deployNginxConf(params: ScriptDTO) {
        const scriptPath = `./src/scripts/add-nginx.sh ${params.associationName} ${params.subDomain}`;
        try {
            const {stdout, stderr} = await execProm(`bash ${scriptPath}`);
            console.log(`Script stdout: ${stdout}`);
            if (stderr) {
                console.error(`Script stderr: ${stderr}`);
                return {message: stderr};
            }
            return {message: stdout};
        } catch (error) {
            console.error(`Error executing script: ${error.message}`);
            return {message: error.message};
        }
    }

    async pauseWebsite(subdomain: string){
        const scriptPath = `./src/scripts/pause-website.sh ${subdomain}`;
        try {
            const {stdout, stderr} = await execProm(`bash ${scriptPath}`);
            console.log(`Script stdout: ${stdout}`);
            if (stderr) {
                console.error(`Script stderr: ${stderr}`);
                return {message: stderr};
            }
            return {message: stdout};
        } catch (error) {
            console.error(`Error executing script: ${error.message}`);
            return {message: error.message};
        }
    }

    async resumeWebsite(subdomain: string){
        const scriptPath = `./src/scripts/resume-website.sh ${subdomain}`;
        try {
            const {stdout, stderr} = await execProm(`bash ${scriptPath}`);
            console.log(`Script stdout: ${stdout}`);
            if (stderr) {
                console.error(`Script stderr: ${stderr}`);
                return {message: stderr};
            }
            return {message: stdout};
        } catch (error) {
            console.error(`Error executing script: ${error.message}`);
            return {message: error.message};
        }
    }

    async deleteWebsite(subdomain: string){
        const scriptPath = `./src/scripts/delete-site.sh ${subdomain}`;
        try {
            const {stdout, stderr} = await execProm(`bash ${scriptPath}`);
            console.log(`Script stdout: ${stdout}`);
            if (stderr) {
                console.error(`Script stderr: ${stderr}`);
                return {message: stderr};
            }
            return {message: stdout};
        } catch (error) {
            console.error(`Error executing script: ${error.message}`);
            return {message: error.message};
        }
    }
}
