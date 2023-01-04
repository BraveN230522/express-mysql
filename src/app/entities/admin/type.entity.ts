import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Tasks } from './task.entity'

@Entity()
export class Types {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  color: string

  @OneToMany(() => Tasks, (task) => task.type)
  tasks: Tasks[]
}
