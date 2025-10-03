import { IsNotEmpty, IsString, Length } from 'class-validator'
import { Field, ID, InputType } from 'type-graphql'

@InputType({ description: 'Data for updating a permission' })
export default class UpdatePermissionInput {
  @Field(() => ID, { nullable: false })
  @IsNotEmpty()
  id!: string

  @Field({ nullable: true })
  @IsString()
  @Length(4, 100)
  name?: string

  @Field({ nullable: true })
  @IsString()
  @Length(4, 1000)
  displayName?: string
}
