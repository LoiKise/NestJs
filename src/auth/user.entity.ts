import { Task } from './../task/task.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userName: string;

  @Column()
  passWord: string;

  // một user sẽ có nhiều task
  @OneToMany((_type) => Task, (task) => task.user, { eager: true })
  task: Task[];
}
