import {
  IsBoolean, IsEmail, IsString, IsUrl, Length, MaxLength,
} from 'class-validator'
import { Field, InputType } from 'type-graphql'

@InputType({ description: 'Data to create a new user' })
export default class CreateUserInput {
  @Field()
  @IsString()
  @Length(4, 100)
  userName!: string

  @Field()
  @IsString()
  @Length(1, 512)
  displayName!: string

  @Field({ nullable: true })
  @IsString()
  @Length(1, 512)
  familyName?: string

  @Field({ nullable: true })
  @IsString()
  @Length(1, 512)
  givenName?: string

  @Field({ nullable: true })
  @IsString()
  @IsUrl()
  @Length(1, 4096)
  profileImageUrl?: string

  @Field({ nullable: true })
  @IsString()
  @IsEmail({
    require_tld: true,
    allow_utf8_local_part: true,
  })
  @MaxLength(1024)
  email?: string

  @Field({ nullable: true })
  @IsBoolean()
  disabled?: boolean
}
