import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "../../user/entities/user.entity";

@ObjectType()
export class AuthPayload {
  @Field(() => User)
  user!: User;
}
