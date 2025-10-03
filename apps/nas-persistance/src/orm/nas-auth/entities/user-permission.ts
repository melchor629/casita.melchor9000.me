import { Field, ID, ObjectType } from 'type-graphql'
import {
  Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn, RelationId,
} from 'typeorm'
import type Permission from './permission.js'
import type User from './user.js'

@Entity()
@Index(['user', 'permission'], { unique: true })
@ObjectType()
export default class UserPermission {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number

  @ManyToOne<User>(
    'User',
    (user) => user.permissions,
    { onDelete: 'CASCADE', onUpdate: 'NO ACTION', nullable: false },
  )
  user!: User

  @RelationId((userPermission: UserPermission) => userPermission.user)
  @Column({ nullable: false })
  userId!: number

  @ManyToOne<Permission>(
    'Permission',
    (permission) => permission.users,
    { onDelete: 'CASCADE', onUpdate: 'NO ACTION', nullable: false },
  )
  permission!: Permission

  @RelationId((userPermission: UserPermission) => userPermission.permission)
  @Column({ nullable: false })
  permissionId!: number

  @Column({ default: false })
  @Field()
  write!: boolean

  @Column({ default: false })
  @Field()
  delete!: boolean
}
