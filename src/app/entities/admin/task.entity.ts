import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm'
import { Users } from './user.entity'
import { Priorities } from './priority.entity'
import { Statuses } from './status.entity'
import { Types } from './type.entity'

@Entity()
export class Tasks {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToOne(() => Users, (user) => user.tasks)
  user: Users

  @ManyToOne(() => Priorities, (priority) => priority.tasks)
  priority: Priorities

  @ManyToOne(() => Statuses, (status) => status.tasks)
  status: Statuses

  @ManyToOne(() => Types, (type) => type.tasks)
  type: Types
}
