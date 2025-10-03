import { IsString } from 'class-validator'
import { Field, InputType } from 'type-graphql'

@InputType({ description: 'Data for updating a login' })
export default class UpdateLoginInput {
  @Field({ nullable: true, simple: true })
  @IsString()
  data?: string

  @Field({ nullable: true })
  disabled?: boolean
}
