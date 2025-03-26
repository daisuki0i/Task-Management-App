import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Tasks } from '../entities/tasks.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Tasks) private readonly tasksRepository: typeof Tasks,
  ) {}

  async getTasks(userId: string) {
    return await this.tasksRepository.findAll({
      where: {
        userId: userId,
      },
    });
  }

  async createTask(createTaskDto: CreateTaskDto, userId: string) {
    const newTask = await this.tasksRepository.create({
      ...createTaskDto,
      userId: userId,
    });
    
    return newTask;
  }

  async getTaskById(id: string, userId: string) {
    const task = await this.tasksRepository.findOne({
      where: {
        id: id,
        userId: userId, // Ensure user can only see their own tasks
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async updateTask(id: string, userId: string, updateTaskDto: UpdateTaskDto) {
    // First check if the task exists and belongs to the user
    const task = await this.tasksRepository.findOne({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    // Update the task
    await task.update(updateTaskDto);
    
    // Return the updated task
    return task.reload();
  }

  async deleteTask(id: string, userId: string) {
    // First check if the task exists and belongs to the user
    const task = await this.tasksRepository.findOne({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    // Delete the task
    await task.destroy();
    
    // Return a success message
    return { 
      message: 'Task deleted successfully',
      id 
    };
  }
}
