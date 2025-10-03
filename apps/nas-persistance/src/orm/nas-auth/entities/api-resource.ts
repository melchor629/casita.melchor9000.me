import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsPositive,
  IsString,
  Length,
} from 'class-validator'
import { GraphQLJSON, GraphQLJSONObject } from 'graphql-type-json'
import { Field, ID, ObjectType } from 'type-graphql'
import {
  Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId,
} from 'typeorm'
import type Application from './application.js'

@Entity()
@ObjectType()
export default class ApiResource {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ nullable: false, length: 500 })
  @Index('api-resource-key-unique', { unique: true })
  @IsNotEmpty()
  @IsString()
  @Length(1, 500)
  @Field(() => ID)
  key!: string

  @Column({ nullable: false, length: 1000 })
  @IsNotEmpty()
  @IsString()
  @Length(4, 1000)
  @Field()
  name!: string

  @Column('jsonb', { nullable: false })
  @IsArray()
  @Field(() => GraphQLJSON)
  scopes!: string[]

  @Column({ nullable: false, length: 1000 })
  @IsNotEmpty()
  @IsString()
  @Length(1, 1000)
  @Field()
  audience!: string

  @Column('character varying', { nullable: false, length: 50, default: 'jwt' })
  @IsString()
  @IsIn(['jwt', 'opaque', 'paseto'])
  @Field(() => String)
  accessTokenFormat!: 'jwt' | 'opaque' | 'paseto'

  @Column({ nullable: true })
  @IsNumber()
  @IsPositive()
  @Field({ nullable: true })
  accessTokenTTL?: number

  @Column('jsonb', { nullable: true })
  @Field(() => GraphQLJSONObject, { nullable: true })
  jwt?: Record<'sign' | 'encrypt', Record<string, never>>

  @Column('jsonb', { nullable: true })
  @Field(() => GraphQLJSONObject, { nullable: true })
  paseto?: Record<string, never>

  @ManyToOne<Application>(
    'Application',
    (a) => a.apiResources,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION', nullable: false },
  )
  @JoinColumn()
  @IsObject({ message: 'application must be filled and must exist' })
  application!: Application

  @RelationId((apiResource: ApiResource) => apiResource.application)
  @Column({ nullable: false })
  applicationId!: number
}
