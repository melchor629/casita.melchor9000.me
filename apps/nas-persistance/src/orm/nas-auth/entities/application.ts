import {
  IsNotEmpty, IsString, Length, Matches,
} from 'class-validator'
import { Field, ID, ObjectType } from 'type-graphql'
import {
  Column, Entity, Index, OneToMany, PrimaryGeneratedColumn,
} from 'typeorm'
import type ApiResource from './api-resource.js'
import type Permission from './permission.js'

@Entity()
@ObjectType()
export default class Application {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number

  @Column({ nullable: false, length: 32 })
  @Index('application-apiKey-unique', { unique: true })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9][\w-]*$/u)
  @Length(1, 32)
  @Field()
  key!: string

  @Column({ nullable: false, length: 500 })
  @IsNotEmpty()
  @IsString()
  @Length(4, 500)
  @Field()
  name!: string

  @OneToMany<Permission>('Permission', (p) => p.application, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  permissions!: Permission[]

  @OneToMany<ApiResource>('ApiResource', (ar) => ar.application, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  apiResources!: ApiResource[]
}
