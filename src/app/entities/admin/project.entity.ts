import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Tasks } from './task.entity'
import { Users } from './user.entity'

@Entity()
export class Projects {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  slug: string

  @Column({ type: 'date' })
  startDate: Date

  @Column({ type: 'date' })
  endDate: Date

  @OneToMany(() => Tasks, (tasks) => tasks.project)
  tasks: Tasks[]

  @ManyToMany(() => Users, (user) => user.id, { cascade: true })
  @JoinTable({
    name: 'users_projects',
    joinColumn: { name: 'projectId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  users: Users[]
}
