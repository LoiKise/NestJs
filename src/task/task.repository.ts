import { User } from './../auth/user.entity';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { Injectable } from '@nestjs/common';

import { DataSource, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { Logger } from '@nestjs/common';

@Injectable()
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository');
  constructor(dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  getTaskById(condition) {
    return this.findOne(condition);
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });
    await this.save(task);
    return task;
  }

  async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');
    query.where({ user });

    if (status) {
      query.andWhere('task.status =:status', { status });
    }
    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) Like LOWER(:search))',
        { search: `%${search}%` },
      );
    }
    try {
      const task = await query.getMany();
      return task;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
