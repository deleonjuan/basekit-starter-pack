import { Field, ObjectType } from "@nestjs/graphql";
import { GraphQLJSON } from "../../common/scalars/json.scalar";

@ObjectType("Setting")
export class SettingType {
  @Field()
  key!: string;

  @Field(() => GraphQLJSON)
  value!: unknown;

  @Field()
  scope!: string;

  @Field()
  type!: string;

  @Field()
  label!: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [String], { nullable: true })
  options?: string[];

  @Field()
  isDefault!: boolean;
}
