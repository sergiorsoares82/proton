import { Test, TestingModule } from '@nestjs/testing';
import { AnimalCategoriesController } from './animal-categories.controller';
import { SequelizeModule, getModelToken } from '@nestjs/sequelize';
import { AnimalCategoryModel } from '@core/animal-category/infra/db/sequelize/animal-category.model';
import { AnimalCategorySequelizeRepository } from '@core/animal-category/infra/db/sequelize/animal-category-sequelize.repository';
import { AnimalCategoriesModule } from './animal-categories.module';
import { DatabaseModule } from '../database/database.module';
import { ConfigModule } from 'src/nest-modules/config-module/config.module';
import { ConfigService } from '@nestjs/config';

describe('AnimalCategoriesController', () => {
  let controller: AnimalCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({}),
        DatabaseModule,
        AnimalCategoriesModule,
      ],
    }).compile();

    controller = module.get<AnimalCategoriesController>(
      AnimalCategoriesController,
    );
    console.log(module.get(ConfigService).get('DB_HOST'));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
