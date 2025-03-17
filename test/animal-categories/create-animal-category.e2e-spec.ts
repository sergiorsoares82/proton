import type { IAnimalCategoryRepository } from '@core/animal-category/domain/animal-category.repository';
import { ANIMAL_CATEGORY_PROVIDERS } from 'src/nest-modules/animal-categories-module/animal-categories.providers';
import { CreateAnimalCategoryFixture } from 'src/nest-modules/animal-categories-module/testing/animal-category-fixture';
import request from 'supertest';
import { startApp } from 'src/nest-modules/shared-module/testing/helpers';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { AnimalCategoriesController } from 'src/nest-modules/animal-categories-module/animal-categories.controller';
import { AnimalCategoryOutputMapper } from '@core/animal-category/application/use-cases/common/animal-category.output';
import { instanceToPlain } from 'class-transformer';

describe('Animal Categories Controller (e2e)', () => {
  const appHelper = startApp();
  let categoryRepo: IAnimalCategoryRepository;

  beforeEach(async () => {
    categoryRepo = appHelper.app.get<IAnimalCategoryRepository>(
      ANIMAL_CATEGORY_PROVIDERS.REPOSITORIES.ANIMAL_CATEGORY_REPOSITORY.provide,
    );
  });
  describe('/categories (POST)', () => {
    describe('should return a response error with 422 status code when request body is invalid', () => {
      const invalidRequest =
        CreateAnimalCategoryFixture.arrangeInvalidRequest();
      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));

      test.each(arrange)('when body is $label', ({ value }) => {
        return request(appHelper.app.getHttpServer())
          .post('/animal-categories')
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should return a response error with 422 status code when throw EntityValidationError', () => {
      const invalidRequest =
        CreateAnimalCategoryFixture.arrangeForEntityValidationError();
      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));

      test.each(arrange)('when body is $label', ({ value }) => {
        return request(appHelper.app.getHttpServer())
          .post('/animal-categories')
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should create a category', () => {
      const arrange = CreateAnimalCategoryFixture.arrangeForCreate();

      test.each(arrange)(
        'when body is $send_data',
        async ({ send_data, expected }) => {
          const res = await request(appHelper.app.getHttpServer())
            .post('/animal-categories')
            .send(send_data)
            .expect(201);

          const keysInResponse = CreateAnimalCategoryFixture.keysInResponse;
          expect(Object.keys(res.body)).toStrictEqual(['data']);
          expect(Object.keys(res.body.data)).toStrictEqual(keysInResponse);
          const id = res.body.data.animalCategoryId;
          const categoryCreated = await categoryRepo.findById(new Uuid(id));

          const presenter = AnimalCategoriesController.serialize(
            AnimalCategoryOutputMapper.toOutput(categoryCreated),
          );
          const serialized = instanceToPlain(presenter);

          expect(res.body.data).toStrictEqual({
            animalCategoryId: serialized.animalCategoryId,
            createdAt: serialized.createdAt,
            ...expected,
          });
        },
      );
    });
  });
});
