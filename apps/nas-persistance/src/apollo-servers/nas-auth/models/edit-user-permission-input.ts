import { IsBoolean, IsNotEmpty } from 'class-validator'
import { Field, ID, InputType } from 'type-graphql'

@InputType({ description: 'Data to edit an user permission' })
export default class EditUserPermissionInput {
  @Field(() => ID)
  @IsNotEmpty()
  id!: number

  @Field(() => ID)
  permissionId?: number

  @Field()
  @IsBoolean()
  write?: boolean

  @Field()
  @IsBoolean()
  delete?: boolean
}
