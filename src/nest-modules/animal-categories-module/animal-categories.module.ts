import { Module } from '@nestjs/common';
import { AnimalCategoriesController } from './animal-categories.controller';
import { getModelToken, SequelizeModule } from '@nestjs/sequelize';
import { AnimalCategoryModel } from '@core/animal-category/infra/db/sequelize/animal-category.model';
import { AnimalCategorySequelizeRepository } from '@core/animal-category/infra/db/sequelize/animal-category-sequelize.repository';
import { ANIMAL_CATEGORY_PROVIDERS } from './animal-categories.providers';

@Module({
  imports: [SequelizeModule.forFeature([AnimalCategoryModel])],
  controllers: [AnimalCategoriesController],
  providers: [
    ...Object.values(ANIMAL_CATEGORY_PROVIDERS.REPOSITORIES),
    ...Object.values(ANIMAL_CATEGORY_PROVIDERS.USE_CASES),
  ],
  exports: [AnimalCategorySequelizeRepository],
})
export class AnimalCategoriesModule {}
