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

  @Column({ type: 'bool' })
  isShow: boolean

  @OneToMany(() => Tasks, (task) => task.type)
  tasks: Tasks[]
}
