import {
  IsBoolean, IsEmail, IsString, IsUrl, Length, MaxLength,
} from 'class-validator'
import { Field, InputType } from 'type-graphql'
import { env } from '../../../config.js'

@InputType({ description: 'Data to update an user' })
export default class UpdateUserInput {
  @Field({ nullable: true })
  @IsString()
  @Length(4, 100)
  userName?: string

  @Field({ nullable: true })
  @IsString()
  @Length(1, 512)
  displayName?: string

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
  @IsUrl({ require_tld: env === 'prod' })
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
