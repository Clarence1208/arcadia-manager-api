import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Website } from "../websites/website.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  surname: string;

  @Column()
  firstName: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    nullable: true,
  })
  loginToken: string;

  @Column({ default: "user" })
  roles: string;

  @OneToMany((type) => Website, (website) => website.user)
  websites: Website[];

  @Column({
    nullable: true,
  })
  stripeCustomerId: string;

}

export class UserWithoutPassword {
  id: number;
  surname: string;
  firstName: string;
  email: string;
  roles: string;
  loginToken: string;
}