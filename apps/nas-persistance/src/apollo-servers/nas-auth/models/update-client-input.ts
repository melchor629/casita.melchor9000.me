import { IsNotEmpty, IsString, MaxLength } from 'class-validator'
import { GraphQLJSONObject } from 'graphql-type-json'
import { Field, ID, InputType } from 'type-graphql'

@InputType({ description: 'Data for updating a new client' })
export default class UpdateClientInput {
  @Field(() => ID, { nullable: false })
  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  clientId!: string

  @Field({ nullable: true })
  @IsString()
  @MaxLength(1024)
  clientName?: string

  @Field(() => GraphQLJSONObject, { nullable: true, simple: true })
  fields?: Record<string, unknown>
}
