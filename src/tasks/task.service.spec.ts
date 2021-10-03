import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing'
import { TaskRepository } from './task.repository'
import { TasksService } from './tasks.service'
import { TaskStatus } from './tasks.status.enum';

const mockTaskRepository = () => ({ 
    getTasks: jest.fn(),
    findOne: jest.fn(),
});

const mockUser = {
    username: 'Daniel',
    id: 'someId',
    password: 'somePasssword',
    tasks: []
}
describe('TaskService', () =>{
    let taskService: TasksService;
    let taskRepository;

    beforeEach( async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: TaskRepository, useFactory: mockTaskRepository },
            ]
        }).compile();

        taskService = module.get(TasksService);
        taskRepository = module.get(TaskRepository);
    });

    describe('getTask', () => {
        it('call TaskRepository.getTasks and returns the result', async () => {            
            taskRepository.getTasks.mockResolvedValue('somevalue')
            const result = await taskService.getTasks(null, mockUser)
            expect(taskRepository.getTasks).toHaveBeenCalled()
            expect(result).toEqual('somevalue')
        })
    })

    describe('getTaskById', () => {
        it('call TaskRepository.findOnde and returns the result', async () => {            
          const mockTask = {
              id: 'someId',
              title: 'Test Title',
              description: 'Test Description',
              status: TaskStatus.OPEN
          };

          taskRepository.findOne.mockResolvedValue(mockTask);

          const result = await taskService.getTaskById('someId', mockUser)

          expect(result).toEqual(mockTask);
        })

        it('call TaskRepository.findOnde and  handles an error', async () => {            
            taskRepository.findOne.mockResolvedValue(null);
            expect(taskService.getTaskById('someId', mockUser)).rejects.toThrow(NotFoundException);
        })
    })

})