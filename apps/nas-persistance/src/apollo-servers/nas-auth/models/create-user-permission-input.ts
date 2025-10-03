import { IsBoolean, IsNotEmpty } from 'class-validator'
import { Field, ID, InputType } from 'type-graphql'

@InputType({ description: 'Data to create a new user permission' })
export default class CreateUserPermissionInput {
  @Field(() => ID)
  @IsNotEmpty()
  userId!: string

  @Field(() => ID)
  @IsNotEmpty()
  permissionId!: string

  @Field()
  @IsNotEmpty()
  @IsBoolean()
  write!: boolean

  @Field()
  @IsNotEmpty()
  @IsBoolean()
  delete!: boolean
}
