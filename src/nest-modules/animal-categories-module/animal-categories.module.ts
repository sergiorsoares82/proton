import { Module } from '@nestjs/common';
import { AnimalCategoriesController } from './animal-categories.controller';
import { getModelToken, SequelizeModule } from '@nestjs/sequelize';
import { AnimalCategoryModel } from '@core/animal-category/infra/db/sequelize/animal-category.model';
import { AnimalCategorySequelizeRepository } from '@core/animal-category/infra/db/sequelize/animal-category-sequelize.repository';

@Module({
  imports: [SequelizeModule.forFeature([AnimalCategoryModel])],
  controllers: [AnimalCategoriesController],
  providers: [
    {
      provide: AnimalCategorySequelizeRepository,
      useFactory: (animalCategoryModel: typeof AnimalCategoryModel) => {
        return new AnimalCategorySequelizeRepository(animalCategoryModel);
      },
      inject: [getModelToken(AnimalCategoryModel)],
    },
  ],
  exports: [AnimalCategorySequelizeRepository],
})
export class AnimalCategoriesModule {}
