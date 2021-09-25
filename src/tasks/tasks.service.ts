import { Injectable, Logger, NotFoundException, Query } from '@nestjs/common';
import { TaskStatus } from './tasks.status.enum';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);


  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) { }

  async getTasks(@Query() filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    return await this.taskRepository.getTasks(filterDto, user)
  }


  async getTaskById(id: string, user: User): Promise<Task> {  
    const foundTask = await this.taskRepository.findOne({where: { id, user }})

    if (!foundTask) {
      throw new NotFoundException(`Task with ID ${id} not found`)
    }
    return foundTask
  }


  async createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
    return await this.taskRepository.createTask(createTaskDTO, user)
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const task = this.getTaskById(id, user);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`)
    }

    await this.taskRepository.deleteTask(id);

    this.logger.log('Task deleted...')
  }

  async updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user)
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`)
    }
    task.status = status

    await this.taskRepository.save(task)

    this.logger.log('Task updated...')
    return task
  }
}



