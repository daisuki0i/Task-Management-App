import { IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description?: string;

  @IsEnum(['pending', 'in_progress', 'completed'], { message: 'Status must be one of: pending, in_progress, completed' })
  @IsOptional()
  status?: 'pending' | 'in_progress' | 'completed';
}
