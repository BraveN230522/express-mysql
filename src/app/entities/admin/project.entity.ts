import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm'
import { Users } from './user.entity'

@Entity()
export class Projects {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  slug: string

  @Column()
  startDate: string

  @Column()
  endDate: string

  @ManyToMany(() => Users, (user) => user.id, { cascade: true })
  @JoinTable({
    name: 'users_projects',
    joinColumn: { name: 'projectId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  users: Users[]
}
