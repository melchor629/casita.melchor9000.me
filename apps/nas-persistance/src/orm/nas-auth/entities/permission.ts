import {
  IsNotEmpty, IsObject, IsString, Length,
} from 'class-validator'
import { Field, ID, ObjectType } from 'type-graphql'
import {
  Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId, Unique,
} from 'typeorm'
import type Application from './application.js'
import type UserPermission from './user-permission.js'

@Entity()
@Unique('permission-name-application-key', ['name', 'application'])
@ObjectType()
export default class Permission {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number

  @Column({ nullable: false, length: 100 })
  @IsNotEmpty()
  @IsString()
  @Length(4, 100)
  @Field()
  name!: string

  @Column({ nullable: true, length: 1000 })
  @IsString()
  @Length(4, 1000)
  @Field({ nullable: true })
  displayName?: string

  @OneToMany<UserPermission>(
    'UserPermission',
    (up) => up.permission,
    { onDelete: 'CASCADE', onUpdate: 'NO ACTION' },
  )
  users!: UserPermission[]

  @ManyToOne<Application>(
    'Application',
    (a) => a.permissions,
    { onDelete: 'CASCADE', onUpdate: 'NO ACTION', nullable: false },
  )
  @JoinColumn()
  @IsObject({ message: 'application must be filled and must exist' })
  application!: Application

  @RelationId((permission: Permission) => permission.application)
  @Column({ nullable: false })
  applicationId!: number
}
