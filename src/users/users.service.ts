import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User, UserWithoutPassword } from "./user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { hash, compare } from "bcrypt";
import { LoginUserDto } from "./dto/login-user.dto";
import { sign } from "jsonwebtoken";
import { LogoutUserDto } from "./dto/logout-user.dto";
import { UsersValidator } from "./dto/users.validator";
import {Stripe} from "stripe";
import * as stripe from "stripe";

@Injectable()
export class UsersService {
  private stripe;
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_API_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });
  }

  async create(user: CreateUserDto): Promise<User> {
    try {
      UsersValidator.validateCreateUserDto(user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
    const otherUser = await this.usersRepository.findOneBy({
      email: user.email,
    });
    if (otherUser) {
      throw new BadRequestException(`Email ${user.email} already exists`);
    }

    user.password = await hash(user.password, 10);
    try {
      const answer = await this.stripe.customers.create({
            email: user.email,
            name: user.firstName + ' ' + user.surname,
      }
      );
      user.stripeCustomerId = answer.id;
      return await this.usersRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException(
          error.message ||
          'An error occurred while creating the customer on stripe',
      );
    }
  }

  async login(user_params: LoginUserDto) {
    try {
      UsersValidator.validateLoginUserDto(user_params);
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    //User connection
    const user = await this.usersRepository.findOneBy({
      email: user_params.email,
    });
    let isValid: boolean = false;
    if (user) {
      isValid = await compare(user_params.password, user.password);
    }
    if (!isValid) {
      throw new BadRequestException(`Invalid email or password`);
    }

    try {
      //Token generation
      const secret = process.env.JWT_SECRET ?? "";
      const token = sign(
        { userId: user.id, email: user.email, roles: user.roles },
        secret,
        {
          expiresIn: "2h",
        },
      );
      await this.usersRepository.update(user.id, { loginToken: token });

      return {
        id: user.id,
        firstName: user.firstName,
        surname: user.surname,
        loginToken: token,
        roles: user.roles,
        customerId: user.stripeCustomerId,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        "Something went wrong please try again",
      );
    }
  }

  async logout(params: LogoutUserDto) {
    if (!params.authToken) {
      throw new BadRequestException(`Missing required field authToken`);
    }
    const user = await this.usersRepository.findOneBy({
      loginToken: params.authToken,
    });
    if (!user) {
      throw new BadRequestException(`Invalid token`);
    }
    await this.usersRepository.update(user.id, { loginToken: "" });
    return {
      message: "User successfully logged out",
    };
  }
  async update(id: number, params: UpdateUserDto): Promise<User> {
    await this.findOne(id);
    if (params.email) {
      const otherUser = await this.usersRepository.findOneBy({
        email: params.email,
      });
      if (otherUser) {
        throw new BadRequestException(`User ${params.email} already exists`);
      }
    }
    await this.usersRepository.update(id, params);
    return await this.usersRepository.findOneBy({ id });
  }

  async findAll(limit?: number, page?: number): Promise<User[]> {
    return await this.usersRepository.find({
      take: limit || 10,
      skip: (page - 1) * limit || 0,
      relations: ["websites"],
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async findOneWithoutPassword(id: number): Promise<UserWithoutPassword> {
    const user = await this.findOne(id);
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      surname: user.surname,
      roles: user.roles,
      loginToken: user.loginToken,
    };
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);
    await this.usersRepository.delete(id);
    return user;
  }
}
