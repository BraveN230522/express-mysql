import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Tasks } from './task.entity'

@Entity()
export class Statuses {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  order: number

  @Column({ type: 'bool' })
  isShow: boolean

  @OneToMany(() => Tasks, (task) => task.status)
  tasks: Tasks[]
}
