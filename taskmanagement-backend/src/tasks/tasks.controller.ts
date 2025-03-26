import { Controller, Get, Post, Patch, Delete, UseGuards, Request, Body, Param } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../users/jwt-auth.guard';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { RequestWithUser } from '../types/jwt-payload';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getTasks(@Request() req: RequestWithUser) {
    // Extract the user ID from the JWT payload
    const userId: string = req.user.userId;
    return this.tasksService.getTasks(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto, @Request() req: RequestWithUser) {
    const userId: string = req.user.userId;
    return this.tasksService.createTask(createTaskDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getTaskById(@Param('id') id: string, @Request() req: RequestWithUser) {
    const userId: string = req.user.userId;
    return this.tasksService.getTaskById(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req: RequestWithUser,
  ) {
    const userId: string = req.user.userId;
    return this.tasksService.updateTask(id, userId, updateTaskDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteTask(@Param('id') id: string, @Request() req: RequestWithUser) {
    const userId: string = req.user.userId;
    return this.tasksService.deleteTask(id, userId);
  }
}
