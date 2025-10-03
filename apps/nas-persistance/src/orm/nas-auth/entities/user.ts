import {
  IsBoolean, IsEmail, IsNotEmpty, IsString, IsUrl, Length, MaxLength,
} from 'class-validator'
import { Field, ID, ObjectType } from 'type-graphql'
import {
  Column, Entity, OneToMany, PrimaryGeneratedColumn,
} from 'typeorm'
import type Login from './login.js'
import type UserPermission from './user-permission.js'

@Entity()
@ObjectType()
export default class User {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number

  @Column({ nullable: false, length: 100 })
  @IsNotEmpty()
  @IsString()
  @Length(6, 100)
  @Field()
  userName!: string

  @Column({ nullable: false, length: 512 })
  @IsNotEmpty()
  @IsString()
  @Length(1, 512)
  @Field()
  displayName!: string

  @Column({ nullable: true, length: 512 })
  @IsString()
  @Length(1, 512)
  @Field({ nullable: true })
  familyName?: string

  @Column({ nullable: true, length: 512 })
  @IsString()
  @Length(1, 512)
  @Field({ nullable: true })
  givenName?: string

  @Column({ nullable: true, length: 4096 })
  @IsString()
  @IsUrl()
  @Length(1, 4096)
  @Field({ nullable: true })
  profileImageUrl?: string

  @Column({ nullable: true, length: 1024 })
  @IsNotEmpty()
  @IsString()
  @IsEmail({
    require_tld: true,
    allow_utf8_local_part: true,
  })
  @MaxLength(1024)
  @Field({ nullable: true })
  email!: string

  @Column({ default: false, nullable: false })
  @IsBoolean()
  @Field()
  disabled!: boolean

  @OneToMany<Login>('Login', (login) => login.user)
  logins!: Login[]

  @OneToMany<UserPermission>('UserPermission', (permission) => permission.user)
  permissions!: UserPermission[]
}
