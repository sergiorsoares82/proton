import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from 'src/nest-modules/config-module/config.module';
import { DatabaseModule } from '../../database-module/database.module';
import { AnimalCategoriesController } from '../animal-categories.controller';
import { AnimalCategoriesModule } from '../animal-categories.module';
import {
  CreateAnimalCategoryUseCase,
  type CreateAnimalCategoryOutput,
} from '@core/animal-category/application/use-cases/create-animal-category/create-animal-category.use-case';
import { Gender } from '@core/animal-category/domain/animal.aggregate';
import type { CreateAnimalCategoryDto } from '../dto/create-animal-category.dto';
import {
  AnimalCategoryCollectionPresenter,
  AnimalCategoryPresenter,
} from '../animal-categories-presenter';
import {
  UpdateAnimalCategoryUseCase,
  type UpdateAnimalCategoryOutput,
} from '@core/animal-category/application/use-cases/update-animal-category/update-animal-category.use-case';
import type { UpdateAnimalCategoryInput } from '@core/animal-category/application/use-cases/update-animal-category/update-animal-category.input';
import {
  GetAnimalCategoryUseCase,
  type GetAnimalCategoryOutput,
} from '@core/animal-category/application/use-cases/get-animal-category/get-animal-category.use-case';
import {
  ListAnimalCategoriesUseCase,
  type ListAnimalCategoriesOutput,
} from '@core/animal-category/application/use-cases/list-animal-category/list-animal-categories.use-case';
import type { SortDirection } from '@core/shared/domain/repository/search-params';
import type { IAnimalCategoryRepository } from '@core/animal-category/domain/animal-category.repository';
import { ANIMAL_CATEGORY_PROVIDERS } from '../animal-categories.providers';
import { DeleteAnimalCategoryUseCase } from '@core/animal-category/application/use-cases/delete-animal-category/delete-animal-category.use-case';
import {
  CreateAnimalCategoryFixture,
  ListAnimalCategoriesFixture,
  UpdateAnimalCategoryFixture,
} from '../testing/animal-category-fixture';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { AnimalCategoryOutputMapper } from '@core/animal-category/application/use-cases/common/animal-category.output';
import { AnimalCategory } from '@core/animal-category/domain/animal-category.aggregate';

describe('AnimalCategoriesController Integration Tests', () => {
  let controller: AnimalCategoriesController;
  let repository: IAnimalCategoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, AnimalCategoriesModule],
    }).compile();
    controller = module.get<AnimalCategoriesController>(
      AnimalCategoriesController,
    );
    repository = module.get<IAnimalCategoryRepository>(
      ANIMAL_CATEGORY_PROVIDERS.REPOSITORIES.ANIMAL_CATEGORY_REPOSITORY.provide,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(controller['createUseCase']).toBeInstanceOf(
      CreateAnimalCategoryUseCase,
    );
    expect(controller['updateUseCase']).toBeInstanceOf(
      UpdateAnimalCategoryUseCase,
    );
    expect(controller['listUseCase']).toBeInstanceOf(
      ListAnimalCategoriesUseCase,
    );
    expect(controller['getUseCase']).toBeInstanceOf(GetAnimalCategoryUseCase);
    expect(controller['deleteUseCase']).toBeInstanceOf(
      DeleteAnimalCategoryUseCase,
    );
  });

  describe('should create a category', () => {
    const arrange = CreateAnimalCategoryFixture.arrangeForCreate();
    test.each(arrange)(
      'when body is $send_data',
      async ({ send_data, expected }) => {
        const presenter = await controller.create(send_data);
        const entity = await repository.findById(
          new Uuid(presenter.animalCategoryId),
        );
        expect(entity.toJSON()).toStrictEqual({
          animalCategoryId: presenter.animalCategoryId,
          createdAt: presenter.createdAt,
          ...expected,
        });
        const output = AnimalCategoryOutputMapper.toOutput(entity);
        expect(presenter).toEqual(new AnimalCategoryPresenter(output));
      },
    );
  });

  describe('should update a category', () => {
    const arrange = UpdateAnimalCategoryFixture.arrangeForUpdate();

    const category = AnimalCategory.fake().aAnimalCategory().build();

    beforeEach(async () => {
      await repository.insert(category);
    });

    test.each(arrange)(
      'when body is $send_data',
      async ({ send_data, expected }) => {
        const presenter = await controller.update(
          category.animalCategoryId.id,
          send_data,
        );
        const entity = await repository.findById(
          new Uuid(presenter.animalCategoryId),
        );
        expect(entity.toJSON()).toStrictEqual({
          animalCategoryId: presenter.animalCategoryId,
          name: expected.name ?? category.name,
          createdAt: presenter.createdAt,
          gender: presenter.gender,
          isActive:
            expected.isActive === true || expected.isActive === false
              ? expected.isActive
              : category.isActive,
        });
        const output = AnimalCategoryOutputMapper.toOutput(entity);
        expect(presenter).toEqual(new AnimalCategoryPresenter(output));
      },
    );
  });

  it('should delete a category', async () => {
    const category = AnimalCategory.fake().aAnimalCategory().build();
    await repository.insert(category);
    const response = await controller.remove(category.animalCategoryId.id);
    expect(response).not.toBeDefined();
    await expect(
      repository.findById(category.animalCategoryId),
    ).resolves.toBeNull();
  });

  it('should get a category', async () => {
    const animalCategory = AnimalCategory.fake().aAnimalCategory().build();
    await repository.insert(animalCategory);
    const presenter = await controller.findOne(
      animalCategory.animalCategoryId.id,
    );

    expect(presenter.animalCategoryId).toBe(animalCategory.animalCategoryId.id);
    expect(presenter.name).toBe(animalCategory.name);
    expect(presenter.gender).toBe(animalCategory.gender);
    expect(presenter.isActive).toBe(animalCategory.isActive);
    expect(presenter.createdAt).toStrictEqual(animalCategory.createdAt);
  });

  describe('search method', () => {
    describe('should sorted categories by createdAt', () => {
      const { entitiesMap, arrange } =
        ListAnimalCategoriesFixture.arrangeIncrementedWithCreatedAt();

      beforeEach(async () => {
        await repository.bulkInsert(Object.values(entitiesMap));
      });

      test.each(arrange)(
        'when send_data is $send_data',
        async ({ send_data, expected }) => {
          const presenter = await controller.search(send_data);
          const { entities, ...paginationProps } = expected;
          expect(presenter).toEqual(
            new AnimalCategoryCollectionPresenter({
              items: entities.map(AnimalCategoryOutputMapper.toOutput),
              ...paginationProps.meta,
            }),
          );
        },
      );
    });

    describe('should return categories using pagination, sort and filter', () => {
      const { entitiesMap, arrange } =
        ListAnimalCategoriesFixture.arrangeUnsorted();

      beforeEach(async () => {
        await repository.bulkInsert(Object.values(entitiesMap));
      });

      test.each(arrange)(
        'when send_data is $send_data',
        async ({ send_data, expected }) => {
          const presenter = await controller.search(send_data);
          const { entities, ...paginationProps } = expected;
          expect(presenter).toEqual(
            new AnimalCategoryCollectionPresenter({
              items: entities.map(AnimalCategoryOutputMapper.toOutput),
              ...paginationProps.meta,
            }),
          );
        },
      );
    });
  });
});
