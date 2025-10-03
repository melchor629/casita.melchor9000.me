import { IsNotEmpty, IsString, Length } from 'class-validator'
import { Field, ID, InputType } from 'type-graphql'

@InputType({ description: 'Data for creating a permission' })
export default class CreatePermissionInput {
  @Field({ nullable: false })
  @IsNotEmpty()
  @IsString()
  @Length(4, 100)
  name!: string

  @Field({ nullable: true })
  @IsString()
  @Length(4, 1000)
  displayName?: string

  @Field(() => ID, { nullable: false })
  @IsNotEmpty()
  applicationId!: string
}
