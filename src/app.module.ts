import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnimalCategoriesModule } from './animal-categories/animal-categories.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { AnimalCategoryModel } from '@core/animal-category/infra/db/sequelize/animal-category.model';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      host: ':memory:',
      logging: false,
      models: [AnimalCategoryModel],
    }),
    AnimalCategoriesModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
