import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator'
import { Field, InputType } from 'type-graphql'

@InputType({ description: 'Data for creating a new application' })
export default class CreateApplicationInput {
  @Field({ nullable: false })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9][\w-]*$/u)
  @Length(1, 32)
  key!: string

  @Field({ nullable: false })
  @IsNotEmpty()
  @IsString()
  @Length(4, 500)
  name!: string
}
