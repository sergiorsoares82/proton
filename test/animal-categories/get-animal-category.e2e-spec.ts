import request from 'supertest';
import { instanceToPlain } from 'class-transformer';
import { startApp } from 'src/nest-modules/shared-module/testing/helpers';
import { AnimalCategory } from '@core/animal-category/domain/animal-category.aggregate';
import { ANIMAL_CATEGORY_PROVIDERS } from 'src/nest-modules/animal-categories-module/animal-categories.providers';
import type { IAnimalCategoryRepository } from '@core/animal-category/domain/animal-category.repository';
import { GetAnimalCategoryFixture } from 'src/nest-modules/animal-categories-module/testing/animal-category-fixture';
import { AnimalCategoriesController } from 'src/nest-modules/animal-categories-module/animal-categories.controller';
import { AnimalCategoryOutputMapper } from '@core/animal-category/application/use-cases/common/animal-category.output';

describe('CategoriesController (e2e)', () => {
  const nestApp = startApp();
  describe('/animal-categories/:id (GET)', () => {
    describe('should throw an error when id is invalid or not found', () => {
      const arrange = [
        {
          animalCategoryId: '88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
          expected: {
            message:
              'AnimalCategory Not Found using ID 88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
            statusCode: 404,
            error: 'Not Found',
          },
        },
        {
          animalCategoryId: 'fake id',
          expected: {
            statusCode: 422,
            message: 'Validation failed (uuid is expected)',
            error: 'Unprocessable Entity',
          },
        },
      ];

      test.each(arrange)(
        'when id is $id',
        async ({ animalCategoryId, expected }) => {
          return request(nestApp.app.getHttpServer())
            .get(`/animal-categories/${animalCategoryId}`)
            .expect(expected.statusCode)
            .expect(expected);
        },
      );
    });

    it('should return a category ', async () => {
      const animalCategoryRepo = nestApp.app.get<IAnimalCategoryRepository>(
        ANIMAL_CATEGORY_PROVIDERS.REPOSITORIES.ANIMAL_CATEGORY_REPOSITORY
          .provide,
      );
      const animalCategory = AnimalCategory.fake().aAnimalCategory().build();
      await animalCategoryRepo.insert(animalCategory);

      const res = await request(nestApp.app.getHttpServer())
        .get(`/animal-categories/${animalCategory.animalCategoryId.id}`)
        .expect(200);
      const keyInResponse = GetAnimalCategoryFixture.keysInResponse;
      expect(Object.keys(res.body)).toStrictEqual(['data']);
      expect(Object.keys(res.body.data)).toStrictEqual(keyInResponse);

      const presenter = AnimalCategoriesController.serialize(
        AnimalCategoryOutputMapper.toOutput(animalCategory),
      );
      const serialized = instanceToPlain(presenter);
      expect(res.body.data).toStrictEqual(serialized);
    });
  });
});
