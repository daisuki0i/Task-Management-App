import { Injectable, OnModuleInit } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly sequelize: Sequelize) {}

  getHello(): string {
    return 'Hello World!';
  }

  async onModuleInit() {
    await this.sequelize.sync({ alter: true });
  }
}
