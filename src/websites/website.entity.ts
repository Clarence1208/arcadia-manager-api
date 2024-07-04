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

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column({
    type: "string",
  })
  associationName: string;

  @ManyToOne((type) => User, (user) => user.websites)
  user: User;
}
