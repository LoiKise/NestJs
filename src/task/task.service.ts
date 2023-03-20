import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { CreateTaskDto } from './dto/create-task.dto';

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { Repository } from 'typeorm';
import { take } from 'rxjs';
import { TaskRepository } from './task.repository';
import { updateStatusTaskDto } from './dto/updateStatus-task.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: { id, user },
    });

    if (!found) {
      throw new NotFoundException(`Task have a ID ${id} not found`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: string, user: User): Promise<void> {
    console.log(
      '🚀 ~ file: task.service.ts:38 ~ TaskService ~ deleteTask ~ id:',
      id,
      user,
    );
    const result = await this.taskRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`Task have a ID ${id} not found`);
    }
  }

  async updateTask(
    id: string,
    updateTask: updateStatusTaskDto,
    user: User,
  ): Promise<Task> {
    const { status, description } = updateTask;
    const task = await this.getTaskById(id, user);
    task.status = status;
    task.description = description;
    await this.taskRepository.save(task);
    return task;
  }

  //   private tasks = [];
  //   // khởi tạo public để ở controller ta có thể truy vấn vào
  //   public getAllTasks() {
  //     return this.tasks;
  //   }
  //   //Filter search by status or title
  //   getTaskWithFilters(filterDto: GetTaskFilterDto): Task[] {
  //     const { status, search } = filterDto;
  //     let tasks = this.getAllTasks();
  //     if (status) {
  //       tasks = tasks.filter((task) => task.status === status);
  //     }
  //     if (search) {
  //       tasks = tasks.filter((task) => {
  //         if (
  //           task.title.toLowerCase().includes(search) ||
  //           task.description.toLowerCase().includes(search)
  //         ) {
  //           return true;
  //         }
  //         return false;
  //       });
  //     }
  //     return tasks;
  //   }
  //   //get task by id
  //   getTaskById(id: string): Task {
  //     // tạo biến foundTask để get được id
  //     const foundTask = this.tasks.find((task) => task.id === id);
  //     // check foundtask có tồn tại hay không
  //     if (!foundTask) {
  //       throw new NotFoundException(`Task have a ID ${id} not found`);
  //     }
  //     return foundTask;
  //   }
  //   createTask(createTaskDto: CreateTaskDto): Task {
  //     const { title, description } = createTaskDto;
  //     const task: Task = {
  //       id: uuid(),
  //       title,
  //       description,
  //       status: TaskStatus.OPEN,
  //     };
  //     //this  trỏ tới private của dòng 7
  //     this.tasks.push(task);
  //     return task;
  //   }
  //   //delete task
  //   deleteTask(id: string): void {
  //     // filter trong mảng task sẽ k còn id nào trùng vs id truyền vào cho nên task ở đây là dấu khác không phai dấu bằng
  //     // line 69 gán found task vs ID đã được tìm thấy ở funtion getTaskByID
  //     const foundTask = this.getTaskById(id);
  //     this.tasks = this.tasks.filter((task) => task.id !== foundTask.id);
  //   }
}
