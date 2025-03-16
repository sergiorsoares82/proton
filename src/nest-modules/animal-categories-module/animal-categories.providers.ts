import { CreateAnimalCategoryUseCase } from '@core/animal-category/application/use-cases/create-animal-category/create-animal-category.use-case';
import { DeleteAnimalCategoryUseCase } from '@core/animal-category/application/use-cases/delete-animal-category/delete-animal-category.use-case';
import { GetAnimalCategoryUseCase } from '@core/animal-category/application/use-cases/get-animal-category/get-animal-category.use-case';
import { ListAnimalCategoriesUseCase } from '@core/animal-category/application/use-cases/list-animal-category/list-animal-categories.use-case';
import { UpdateAnimalCategoryUseCase } from '@core/animal-category/application/use-cases/update-animal-category/update-animal-category.use-case';
import type { IAnimalCategoryRepository } from '@core/animal-category/domain/animal-category.repository';
import { AnimalCategoryInMemoryRepository } from '@core/animal-category/infra/db/in-memory/animal-category-in-memory.repository';
import { AnimalCategorySequelizeRepository } from '@core/animal-category/infra/db/sequelize/animal-category-sequelize.repository';
import { AnimalCategoryModel } from '@core/animal-category/infra/db/sequelize/animal-category.model';
import { getModelToken } from '@nestjs/sequelize';

export const REPOSITORIES = {
  ANIMAL_CATEGORY_REPOSITORY: {
    provide: 'AnimalCategoryRepository',
    useExisting: AnimalCategorySequelizeRepository,
  },
  ANIMAL_CATEGORY_IN_MEMORY_REPOSITORY: {
    provide: AnimalCategoryInMemoryRepository,
    useClass: AnimalCategoryInMemoryRepository,
  },
  ANIMAL_CATEGORY_SEQUELIZE_REPOSITORY: {
    provide: AnimalCategorySequelizeRepository,
    useFactory: (animalCategoryModel: typeof AnimalCategoryModel) => {
      return new AnimalCategorySequelizeRepository(animalCategoryModel);
    },
    inject: [getModelToken(AnimalCategoryModel)],
  },
};

export const USE_CASES = {
  CREATE_ANIMAL_CATEGORY_USE_CASE: {
    provide: CreateAnimalCategoryUseCase,
    useFactory: (categoryRepo: IAnimalCategoryRepository) => {
      return new CreateAnimalCategoryUseCase(categoryRepo);
    },
    inject: [REPOSITORIES.ANIMAL_CATEGORY_REPOSITORY.provide],
  },
  UPDATE_ANIMAL_CATEGORY_USE_CASE: {
    provide: UpdateAnimalCategoryUseCase,
    useFactory: (animalCategoryRepo: IAnimalCategoryRepository) => {
      return new UpdateAnimalCategoryUseCase(animalCategoryRepo);
    },
    inject: [REPOSITORIES.ANIMAL_CATEGORY_REPOSITORY.provide],
  },
  LIST_CATEGORIES_USE_CASE: {
    provide: ListAnimalCategoriesUseCase,
    useFactory: (animalCategoryRepo: IAnimalCategoryRepository) => {
      return new ListAnimalCategoriesUseCase(animalCategoryRepo);
    },
    inject: [REPOSITORIES.ANIMAL_CATEGORY_REPOSITORY.provide],
  },
  GET_ANIMAL_CATEGORY_USE_CASE: {
    provide: GetAnimalCategoryUseCase,
    useFactory: (animalCategoryRepo: IAnimalCategoryRepository) => {
      return new GetAnimalCategoryUseCase(animalCategoryRepo);
    },
    inject: [REPOSITORIES.ANIMAL_CATEGORY_REPOSITORY.provide],
  },
  DELETE_ANIMAL_CATEGORY_USE_CASE: {
    provide: DeleteAnimalCategoryUseCase,
    useFactory: (animalCategoryRepo: IAnimalCategoryRepository) => {
      return new DeleteAnimalCategoryUseCase(animalCategoryRepo);
    },
    inject: [REPOSITORIES.ANIMAL_CATEGORY_REPOSITORY.provide],
  },
};

export const ANIMAL_CATEGORY_PROVIDERS = {
  REPOSITORIES,
  USE_CASES,
};
