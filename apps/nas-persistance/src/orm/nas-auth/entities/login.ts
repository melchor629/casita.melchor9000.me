import { IsBoolean, IsString } from 'class-validator'
import { GraphQLJSONObject } from 'graphql-type-json'
import { Field, ID, ObjectType } from 'type-graphql'
import {
  Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId,
} from 'typeorm'
import type User from './user.js'

@Entity()
@Index(['type', 'loginId'], { unique: true })
@ObjectType()
export default class Login {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number

  @Column({ nullable: false, length: 50 })
  @IsString()
  @Field()
  type!: string

  @Column({ nullable: false, length: 2048 })
  @IsString()
  @Field()
  loginId!: string

  @Column('jsonb', { nullable: true, default: null })
  @Field(() => GraphQLJSONObject, { nullable: true, simple: true })
  data!: Record<string, unknown> | null

  @Column({ default: false, nullable: false })
  @IsBoolean()
  @Field()
  disabled!: boolean

  @ManyToOne<User>('User', (user) => user.logins, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION', nullable: false })
  @JoinColumn()
  user!: User

  @RelationId((login: Login) => login.user)
  @Column({ nullable: false })
  userId!: number
}
