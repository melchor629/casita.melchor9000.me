import {
  IsJSON, IsNumber, IsString, MaxLength, Min,
} from 'class-validator'
import { Field, InputType, Int } from 'type-graphql'

@InputType({ description: 'Data for creating a new login' })
export default class CreateLoginInput {
  @Field()
  @IsString()
  @MaxLength(50)
  type!: string

  @Field()
  @IsString()
  @MaxLength(2048)
  loginId!: string

  @Field(() => Int)
  @IsNumber()
  @Min(1)
  userId!: number

  @Field({ nullable: true, simple: true })
  @IsJSON()
  data?: string

  @Field({ nullable: true })
  disabled?: boolean
}
