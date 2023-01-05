import { Tasks } from './task.entity'
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm'
import { Projects } from './project.entity'

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  inviteId: string

  @Column({
    nullable: true,
    default: null,
  })
  name?: string

  @Column({
    nullable: true,
    default: null,
    type: 'date',
  })
  dob?: Date

  @Column({
    nullable: true,
    default: null,
  })
  email: string

  @Column({
    nullable: true,
    default: null,
  })
  password: string

  @Column()
  status: string

  @OneToMany(() => Tasks, (tasks) => tasks.user)
  tasks: Tasks[]

  @ManyToMany(() => Projects, (project) => project.id, { cascade: true })
  @JoinTable({
    name: 'users_projects',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'projectId', referencedColumnName: 'id' },
  })
  projects: Projects[]
}
