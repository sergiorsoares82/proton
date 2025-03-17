import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from 'src/nest-modules/config-module/config.module';
import { DatabaseModule } from '../../database-module/database.module';
import { AnimalCategoriesController } from '../animal-categories.controller';
import { AnimalCategoriesModule } from '../animal-categories.module';
import type { CreateAnimalCategoryOutput } from '@core/animal-category/application/use-cases/create-animal-category/create-animal-category.use-case';
import { Gender } from '@core/animal-category/domain/animal.aggregate';
import type { CreateAnimalCategoryDto } from '../dto/create-animal-category.dto';
import {
  AnimalCategoryCollectionPresenter,
  AnimalCategoryPresenter,
} from '../animal-categories-presenter';
import type { UpdateAnimalCategoryOutput } from '@core/animal-category/application/use-cases/update-animal-category/update-animal-category.use-case';
import type { UpdateAnimalCategoryInput } from '@core/animal-category/application/use-cases/update-animal-category/update-animal-category.input';
import type { GetAnimalCategoryOutput } from '@core/animal-category/application/use-cases/get-animal-category/get-animal-category.use-case';
import type { ListAnimalCategoriesOutput } from '@core/animal-category/application/use-cases/list-animal-category/list-animal-categories.use-case';
import type { SortDirection } from '@core/shared/domain/repository/search-params';

describe('AnimalCategoriesController', () => {
  let controller: AnimalCategoriesController;

  controller = new AnimalCategoriesController();

  it('should create an animal category', async () => {
    const output: CreateAnimalCategoryOutput = {
      animalCategoryId: '9366b7dc-2d71-4799-b91c-c64adb205104',
      name: 'Dog',
      gender: Gender.FEMALE,
      isActive: true,
      createdAt: new Date(),
    };

    const mockCreateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    //@ts-expect-error defined part of methods
    controller['createUseCase'] = mockCreateUseCase;
    const input: CreateAnimalCategoryDto = {
      name: 'Movie',
      gender: Gender.FEMALE,
      isActive: true,
    };

    //Act
    const presenter = await controller.create(input);

    //Assert
    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
    expect(presenter).toBeInstanceOf(AnimalCategoryPresenter);
    expect(presenter).toStrictEqual(new AnimalCategoryPresenter(output));
  });

  it('should update an animal category', async () => {
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    const output: UpdateAnimalCategoryOutput = {
      animalCategoryId: id,
      name: 'Movie',
      gender: Gender.FEMALE,
      isActive: true,
      createdAt: new Date(),
    };
    const mockUpdateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error defined part of methods
    controller['updateUseCase'] = mockUpdateUseCase;
    const input: Omit<UpdateAnimalCategoryInput, 'animalCategoryId'> = {
      name: 'Movie',
      gender: 'F',
      isActive: true,
    };
    const presenter = await controller.update(id, input);
    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({
      animalCategoryId: id,
      ...input,
    });
    expect(presenter).toBeInstanceOf(AnimalCategoryPresenter);
    expect(presenter).toStrictEqual(new AnimalCategoryPresenter(output));
  });

  it('should deletes a category', async () => {
    const expectedOutput = undefined;
    const mockDeleteUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };
    //@ts-expect-error defined part of methods
    controller['deleteUseCase'] = mockDeleteUseCase;
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    expect(controller.remove(id)).toBeInstanceOf(Promise);
    const output = await controller.remove(id);
    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({
      animalCategoryId: id,
    });
    expect(expectedOutput).toStrictEqual(output);
  });

  it('should gets a category', async () => {
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    const output: GetAnimalCategoryOutput = {
      animalCategoryId: id,
      name: 'Movie',
      gender: 'F',
      isActive: true,
      createdAt: new Date(),
    };
    const mockGetUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error defined part of methods
    controller['getUseCase'] = mockGetUseCase;
    const presenter = await controller.findOne(id);
    expect(mockGetUseCase.execute).toHaveBeenCalledWith({
      animalCategoryId: id,
    });
    expect(presenter).toBeInstanceOf(AnimalCategoryPresenter);
    expect(presenter).toStrictEqual(new AnimalCategoryPresenter(output));
  });

  it('should list categories', async () => {
    const output: ListAnimalCategoriesOutput = {
      items: [
        {
          animalCategoryId: '9366b7dc-2d71-4799-b91c-c64adb205104',
          name: 'Movie',
          gender: 'F',
          isActive: true,
          createdAt: new Date(),
        },
      ],
      current_page: 1,
      last_page: 1,
      per_page: 1,
      total: 1,
    };
    const mockListUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error defined part of methods
    controller['listUseCase'] = mockListUseCase;
    const searchParams = {
      page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'desc' as SortDirection,
      filter: 'test',
    };
    const presenter = await controller.search(searchParams);
    expect(presenter).toBeInstanceOf(AnimalCategoryCollectionPresenter);
    expect(mockListUseCase.execute).toHaveBeenCalledWith(searchParams);
    expect(presenter).toEqual(new AnimalCategoryCollectionPresenter(output));
  });
});
