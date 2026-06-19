import { Field, InputType } from "@nestjs/graphql";
import { GraphQLJSON } from "../../common/scalars/json.scalar";

@InputType()
export class UpdateSettingInput {
  @Field()
  key!: string;

  @Field(() => GraphQLJSON)
  value!: unknown;
}
