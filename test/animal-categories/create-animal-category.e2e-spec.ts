import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { applyGlobalConfig } from '../../src/nest-modules/global-config';
import { IAnimalCategoryRepository } from '@core/animal-category/domain/animal-category.repository';
import { ANIMAL_CATEGORY_PROVIDERS } from 'src/nest-modules/animal-categories-module/animal-categories.providers';
import { CreateAnimalCategoryFixture } from 'src/nest-modules/animal-categories-module/testing/animal-category-fixture';
import { startApp } from 'src/nest-modules/shared-module/testing/helpers';

describe('CategoriesController (e2e)', () => {
  let animalCategoryRepo: IAnimalCategoryRepository;

  const appHelper = startApp();
  beforeEach(async () => {
    animalCategoryRepo = appHelper.app.get<IAnimalCategoryRepository>(
      ANIMAL_CATEGORY_PROVIDERS.REPOSITORIES.ANIMAL_CATEGORY_REPOSITORY.provide,
    );
  });
  describe('/categories (POST)', () => {
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
        // const presenter = await controller.create(send_data);
        // const entity = await repository.findById(new Uuid(presenter.id));
        // expect(entity.toJSON()).toStrictEqual({
        //   category_id: presenter.id,
        //   created_at: presenter.created_at,
        //   ...expected,
        // });
        // const output = CategoryOutputMapper.toOutput(entity);
        // expect(presenter).toEqual(new CategoryPresenter(output));
      },
    );
  });
  //   let app: INestApplication;

  //   beforeEach(async () => {
  //     const moduleFixture: TestingModule = await Test.createTestingModule({
  //       imports: [AppModule],
  //     }).compile();

  //     app = moduleFixture.createNestApplication();
  //     await app.init();
  //   });

  //   it('/ (GET)', () => {
  //     return request(app.getHttpServer())
  //       .get('/')
  //       .expect(200)
  //       .expect('Hello World!');
  //   });
});
