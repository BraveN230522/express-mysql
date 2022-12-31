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

  @ManyToMany(() => Users)
  @JoinTable()
  categories: Users[]
}
