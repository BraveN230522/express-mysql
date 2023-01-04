import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { Users } from './user.entity'
import { Priorities } from './priority.entity'
import { Statuses } from './status.entity'
import { Types } from './type.entity'
import { Projects } from './project.entity'

@Entity()
export class Tasks {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ type: 'date' })
  startDate: Date

  @Column({ type: 'date' })
  endDate: Date

  @ManyToOne(() => Users, (user) => user.tasks)
  user: Users

  @ManyToOne(() => Projects, (project) => project.tasks)
  project: Projects

  @ManyToOne(() => Priorities, (priority) => priority.tasks)
  priority: Priorities

  @ManyToOne(() => Statuses, (status) => status.tasks)
  status: Statuses

  @ManyToOne(() => Types, (type) => type.tasks)
  type: Types
}
