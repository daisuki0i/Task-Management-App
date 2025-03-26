import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Tasks } from '../entities/tasks.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    SequelizeModule.forFeature([Tasks]),
    PassportModule,
  ],
  controllers: [TasksController],
  providers: [TasksService]
})
export class TasksModule {}
