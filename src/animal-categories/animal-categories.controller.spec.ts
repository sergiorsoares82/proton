import { Test, TestingModule } from '@nestjs/testing';
import { AnimalCategoriesController } from './animal-categories.controller';
import { SequelizeModule, getModelToken } from '@nestjs/sequelize';
import { AnimalCategoryModel } from '@core/animal-category/infra/db/sequelize/animal-category.model';
import { AnimalCategorySequelizeRepository } from '@core/animal-category/infra/db/sequelize/animal-category-sequelize.repository';
import { AnimalCategoriesModule } from './animal-categories.module';
import { DatabaseModule } from '../database/database.module';

describe('AnimalCategoriesController', () => {
  let controller: AnimalCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, AnimalCategoriesModule], // ✅ Ensure module is imported
    }).compile();

    controller = module.get<AnimalCategoriesController>(
      AnimalCategoriesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
