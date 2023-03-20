import { IsEnum, IsString, IsOptional } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class updateStatusTaskDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsString()
  @IsOptional()
  description?: string;
}
