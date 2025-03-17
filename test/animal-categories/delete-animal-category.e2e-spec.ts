import { AnimalCategory } from '@core/animal-category/domain/animal-category.aggregate';
import type { IAnimalCategoryRepository } from '@core/animal-category/domain/animal-category.repository';
import { ANIMAL_CATEGORY_PROVIDERS } from 'src/nest-modules/animal-categories-module/animal-categories.providers';
import { startApp } from 'src/nest-modules/shared-module/testing/helpers';
import request from 'supertest';

describe('CategoriesController (e2e)', () => {
  describe('/delete/:id (DELETE)', () => {
    const appHelper = startApp();
    describe('should a response error when id is invalid or not found', () => {
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
          return request(appHelper.app.getHttpServer())
            .delete(`/animal-categories/${animalCategoryId}`)
            .expect(expected.statusCode)
            .expect(expected);
        },
      );
    });

    it('should delete a category response with status 204', async () => {
      const animalCategoryRepo = appHelper.app.get<IAnimalCategoryRepository>(
        ANIMAL_CATEGORY_PROVIDERS.REPOSITORIES.ANIMAL_CATEGORY_REPOSITORY
          .provide,
      );
      const animalCategory = AnimalCategory.fake().aAnimalCategory().build();
      await animalCategoryRepo.insert(animalCategory);

      await request(appHelper.app.getHttpServer())
        .delete(`/animal-categories/${animalCategory.animalCategoryId.id}`)
        .expect(204);

      await expect(
        animalCategoryRepo.findById(animalCategory.animalCategoryId),
      ).resolves.toBeNull();
    });
  });
});
