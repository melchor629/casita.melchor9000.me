import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator'
import { Field, ID, InputType } from 'type-graphql'

@InputType({ description: 'Data for updating an application' })
export default class UpdateApplicationInput {
  @Field(() => ID, { nullable: false })
  @IsNotEmpty()
  id!: string

  @Field({ nullable: true })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9][\w-]*$/u)
  @Length(1, 32)
  key?: string

  @Field({ nullable: true })
  @IsNotEmpty()
  @IsString()
  @Length(4, 500)
  name?: string
}
