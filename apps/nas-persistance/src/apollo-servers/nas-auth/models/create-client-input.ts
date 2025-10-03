import { IsNotEmpty, IsString, MaxLength } from 'class-validator'
import { GraphQLJSONObject } from 'graphql-type-json'
import { Field, ID, InputType } from 'type-graphql'

@InputType({ description: 'Data for creating a new client' })
export default class CreateClientInput {
  @Field(() => ID, { nullable: false })
  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  clientId!: string

  @Field({ nullable: false })
  @IsNotEmpty()
  @IsString()
  @MaxLength(1024)
  clientName!: string

  @Field(() => GraphQLJSONObject, { nullable: true, simple: true })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields?: Record<string, any>
}
