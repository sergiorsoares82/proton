import { AnimalCategoryModel } from '@core/animal-category/infra/db/sequelize/animal-category.model';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

const models = [AnimalCategoryModel];

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'sqlite' as any,
      host: ':memory:',
      logging: false,
      models,
    }),
  ],
})
export class DatabaseModule {}
