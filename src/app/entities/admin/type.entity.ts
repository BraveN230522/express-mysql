import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Tasks } from './task.entity'

@Entity()
export class Types {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  order: number

  @OneToMany(() => Tasks, (task) => task.type)
  tasks: Tasks[]
}
