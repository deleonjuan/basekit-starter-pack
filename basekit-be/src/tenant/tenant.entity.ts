import { Field, ID, ObjectType } from "@nestjs/graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { GraphQLJSON } from "../common/scalars/json.scalar";

@ObjectType()
@Entity("tenants")
export class Tenant {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field()
  @Column({ unique: true })
  slug!: string;

  @Field()
  @Column()
  name!: string;

  @Field(() => GraphQLJSON, { nullable: true })
  @Column({ name: "configuration", type: "jsonb", nullable: true })
  configuration!: Record<string, any>;

  @Field()
  @Column({ name: "is_active", default: true })
  isActive!: boolean;

  @Field()
  @CreateDateColumn({
    name: "created_at",
    type: "timestamptz",
    default: () => "NOW()",
  })
  createdAt!: Date;

  @Field()
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
