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

@InputType({ description: 'Data for creating a new api resource' })
export default class CreateApiResourceInput {
  @IsNotEmpty()
  @IsString()
  @Length(1, 500)
  @Field(() => ID)
  key!: string

  @IsNotEmpty()
  @IsString()
  @Length(4, 1000)
  @Field()
  name!: string

  @IsArray()
  @Field(() => GraphQLJSON)
  scopes!: string[]

  @IsNotEmpty()
  @IsString()
  @Length(1, 1000)
  @Field()
  audience!: string

  @IsString()
  @IsIn(['jwt', 'opaque', 'paseto'])
  @Field(() => String)
  accessTokenFormat!: 'jwt' | 'opaque' | 'paseto'

  @IsNumber()
  @IsPositive()
  @Field({ nullable: true })
  accessTokenTTL?: number

  @Field(() => GraphQLJSONObject, { nullable: true })
  jwt?: Record<'sign' | 'encrypt', Record<string, never>>

  @Field(() => GraphQLJSONObject, { nullable: true })
  paseto?: Record<string, never>

  @Field(() => ID)
  applicationId!: string
}
