import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
} from 'class-validator'
import { GraphQLJSON, GraphQLJSONObject } from 'graphql-type-json'
import { Field, ID, InputType } from 'type-graphql'

@InputType({ description: 'Data for updating an api resource' })
export default class UpdateApiResourceInput {
  @IsNotEmpty()
  @IsString()
  @Length(1, 500)
  @Field(() => ID)
  key!: string

  @IsString()
  @Length(4, 1000)
  @Field({ nullable: true })
  name?: string

  @IsArray()
  @Field(() => GraphQLJSON, { nullable: true })
  scopes?: string[]

  @IsString()
  @Length(1, 1000)
  @Field({ nullable: true })
  audience?: string

  @IsString()
  @IsIn(['jwt', 'opaque', 'paseto'])
  @Field(() => String, { nullable: true })
  accessTokenFormat?: 'jwt' | 'opaque' | 'paseto'

  @IsNumber()
  @IsPositive()
  @Field({ nullable: true })
  accessTokenTTL?: number

  @Field(() => GraphQLJSONObject, { nullable: true })
  jwt?: Record<'sign' | 'encrypt', Record<string, never>>

  @Field(() => GraphQLJSONObject, { nullable: true })
  paseto?: Record<string, never>
}
