import { ConfigService } from '@nestjs/config';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { TaskService } from './task.service';
import { updateStatusTaskDto } from './dto/updateStatus-task.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TaskController {
  private logger = new Logger('Taskcontroller');
  constructor(
    private configService: ConfigService,
    private taskService: TaskService,
  ) {
    console.log(configService.get('TEST_VALUE'));
  }
  @Get()
  getTasks(
    @Query() filterDto: GetTaskFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User ${user.userName} get tasks, "${JSON.stringify(filterDto)}"`,
    );
    return this.taskService.getTasks(filterDto, user);
  }

  @Get('/:id')
  getTaskByid(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    return this.taskService.getTaskById(id, user);
  }

  @Post()
  createTast(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `user: "${user.userName} creating new task.Data: ${JSON.stringify(
        createTaskDto,
      )}"`,
    );
    return this.taskService.createTask(createTaskDto, user);
  }

  // @Delete('/:id')
  // deleteTask(@Param('id') @GetUser()  id: string,user: User): Promise<void> {
  //   return this.taskService.deleteTask(id, user);
  // }

  @Delete('/:id')
  deleteTask(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.taskService.deleteTask(id, user);
  }

  //   @Get()
  //   getAllTasks(@Query() filterDto: GetTaskFilterDto) {
  //     if (Object.keys(filterDto).length) {
  //       return this.taskService.getTaskWithFilters(filterDto);
  //     } else {
  //       return this.taskService.getAllTasks();
  //     }
  //   }

  //   /**
  //    *Get Task by id
  //    * **/

  //   @Get('/:id')
  //   getTaskById(@Param('id') id: string): Task {
  //     return this.taskService.getTaskById(id);
  //   }

  //   //Cách 1
  //   //   @Post()
  //   //   createTast(@Body() body) {
  //   //     console.log(body);
  //   //   }

  //   //Cách 2

  //   @Delete('/:id')
  //   deleteTask(@Param('id') id: string): void {
  //     return this.taskService.deleteTask(id);
  //   }

  @Patch('/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateTask: updateStatusTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    // const { status } = updateTask;
    return this.taskService.updateTask(id, updateTask, user);
  }
}
