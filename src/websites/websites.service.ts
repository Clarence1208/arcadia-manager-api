import {BadRequestException, Injectable, InternalServerErrorException, NotFoundException,} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Website} from "./website.entity";
import {CreateWebsiteDto} from "./dto/create-website-dto";
import {UpdateWebsiteDto} from "./dto/update-website.dto";
import {WebsitesValidator} from "./dto/websites.validator";
import {User} from "../users/user.entity";
import {exec} from "child_process";

type ScriptDTO = {
    name: string;
    subDomain: string;
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
            //TODO: RUN THE SCRIPT TO DEPLOY AND PERSONALIZE NEW DOCKER
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
        const scriptPath = "/root/scripts/new-dommain.sh " + params.name + " " + params.subDomain;
        let message;
        exec(`bash ${scriptPath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing script: ${error.message}`);
                message = error.message;
            }
            if (stderr) {
                console.error(`Script stderr: ${stderr}`);
                message = stderr;
            }
            console.log(`Script stdout: ${stdout}`);
            message = stdout;
        });
        return {
            message: message
        }
    }

    async deployAPIdocker(params: ScriptDTO) {
//./root/scripts/deploy-api.sh <name> <subdomain>
        const scriptPath = "/scripts/deploy-api.sh " + params.name + " " + params.subDomain;
        let message;
        exec(`bash ${scriptPath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing script: ${error.message}`);
                message = error.message;
            }
            if (stderr) {
                console.error(`Script stderr: ${stderr}`);
                message = stderr;
            }
            console.log(`Script stdout: ${stdout}`);
            message = stdout;
        });
        return {
            message: message
        }
    }


    async deployFrontendDocker(params: ScriptDTO) {
        // ./root/scripts/deploy-front.sh <name> <subdomain>
        const scriptPath = "/root/scripts/deploy-front.sh " + params.name + " " + params.subDomain;
        let message;
        exec(`bash ${scriptPath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing script: ${error.message}`);
                message = error.message;
            }
            if (stderr) {
                console.error(`Script stderr: ${stderr}`);
                message = stderr;
            }
            console.log(`Script stdout: ${stdout}`);
            message = stdout;
        });
        return {
            message: message
        }
    }

    async deployNginxConf(params: ScriptDTO) {
//./root/scripts/add-nginx.sh <name> <subdomain>
        const scriptPath = "/root/scripts/add-nginx.sh " + params.name + " " + params.subDomain;
        let message;
        exec(`bash ${scriptPath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing script: ${error.message}`);
                message = error.message;
            }
            if (stderr) {
                console.error(`Script stderr: ${stderr}`);
                message = stderr;
            }
            console.log(`Script stdout: ${stdout}`);
            message = stdout;
        });
        return {
            message: message
        }
    }
}
