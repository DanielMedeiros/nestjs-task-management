import { User } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreateTaskDTO } from "./dto/create-task.dto";
import { GetTaskFilterDto } from "./dto/get-task-filter.dto";
import { Task } from "./task.entity";
import { TaskStatus } from "./tasks.status.enum";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task>{

  async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;

    const query = this.createQueryBuilder('task');
    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status })
    }

    if (search) {
      query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` })
    }
    const tasks = await query.getMany();

    return tasks;

  }

  async createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
    const { title, description } = createTaskDTO

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user
    })

    await this.save(task)

    return task
  }

  async deleteTask(id: string): Promise<void> {
    await this.delete(id)
  }


}