import { IsNotEmpty, IsString, MaxLength } from 'class-validator'
import { GraphQLJSONObject } from 'graphql-type-json'
import { Field, ID, ObjectType } from 'type-graphql'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
@ObjectType()
export default class Client {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ nullable: false, unique: true, length: 128 })
  @Field(() => ID)
  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  clientId!: string

  @Column({ nullable: false, length: 1024 })
  @Field()
  @IsNotEmpty()
  @IsString()
  @MaxLength(1024)
  clientName!: string

  @Column('jsonb', { nullable: false })
  @Field(() => GraphQLJSONObject, { simple: true })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields!: Record<string, any>
}
