import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Tasks } from './task.entity'

@Entity()
export class Priorities {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  order: string

  @OneToMany(() => Tasks, (task) => task.priority)
  tasks: Tasks[]
}
