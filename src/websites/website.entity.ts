import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "../users/user.entity";

@Entity()
export class Website {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: "active" })
  status: string;

  @Column({
    unique: true,
  })
  url: string;

  @Column()
  createdAt: Date;

  @ManyToOne((type) => User, (user) => user.websites)
  user: User;
}
