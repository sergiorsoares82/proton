import { AnimalCategory } from '@core/animal-category/domain/animal-category.aggregate';
import { Gender } from '@core/animal-category/domain/animal.aggregate';

const _keysInResponse = ['id', 'name', 'gender', 'isActive', 'createdAt'];

export class GetAnimalCategoryFixture {
  static keysInResponse = _keysInResponse;
}

export class CreateAnimalCategoryFixture {
  static keysInResponse = _keysInResponse;

  static arrangeForCreate() {
    const faker = AnimalCategory.fake()
      .aAnimalCategory()
      .withName('Movie')
      .withGender(Gender.FEMALE);
    return [
      {
        send_data: {
          name: faker.name,
          gender: faker.gender,
        },
        expected: {
          name: faker.name,
          gender: faker.gender,
          isActive: true,
        },
      },
      {
        send_data: {
          name: faker.name,
          gender: faker.gender,
          isActive: true,
        },
        expected: {
          name: faker.name,
          gender: faker.gender,
          isActive: true,
        },
      },
      {
        send_data: {
          name: faker.name,
          gender: faker.gender,
          isActive: false,
        },
        expected: {
          name: faker.name,
          gender: faker.gender,
          isActive: false,
        },
      },
    ];
  }

  static arrangeInvalidRequest() {
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      EMPTY: {
        send_data: {},
        expected: {
          message: ['name should not be empty', 'name must be a string'],
          ...defaultExpected,
        },
      },
      NAME_UNDEFINED: {
        send_data: {
          name: undefined,
        },
        expected: {
          message: ['name should not be empty', 'name must be a string'],
          ...defaultExpected,
        },
      },
      NAME_NULL: {
        send_data: {
          name: null,
        },
        expected: {
          message: ['name should not be empty', 'name must be a string'],
          ...defaultExpected,
        },
      },
      NAME_EMPTY: {
        send_data: {
          name: '',
        },
        expected: {
          message: ['name should not be empty'],
          ...defaultExpected,
        },
      },
      GENDER_NOT_A_STRING: {
        send_data: {
          gender: 5,
        },
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'gender must be a string',
          ],
          ...defaultExpected,
        },
      },
      IS_ACTIVE_NOT_A_BOOLEAN: {
        send_data: {
          isActive: 'a',
        },
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'isActive must be a boolean value',
          ],
          ...defaultExpected,
        },
      },
    };
  }

  static arrangeForEntityValidationError() {
    const faker = AnimalCategory.fake().aAnimalCategory();
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      NAME_TOO_LONG: {
        send_data: {
          name: faker.withInvalidNameTooLong().name,
        },
        expected: {
          message: ['name must be shorter than or equal to 255 characters'],
          ...defaultExpected,
        },
      },
    };
  }
}

export class UpdateAnimalCategoryFixture {
  static keysInResponse = _keysInResponse;

  static arrangeForUpdate() {
    const faker = AnimalCategory.fake()
      .aAnimalCategory()
      .withName('Movie')
      .withGender(Gender.FEMALE);
    return [
      {
        send_data: {
          name: faker.name,
          gender: faker.gender,
          isActive: true,
        },
        expected: {
          name: faker.name,
          gender: faker.gender,
          isActive: true,
        },
      },
      {
        send_data: {
          name: faker.name,
          gender: faker.gender,
        },
        expected: {
          name: faker.name,
          gender: faker.gender,
          isActive: true,
        },
      },
    ];
  }

  static arrangeInvalidRequest() {
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      GENDER_NOT_A_STRING: {
        send_data: {
          gender: 5,
        },
        expected: {
          message: ['gender must be a string'],
          ...defaultExpected,
        },
      },
      IS_ACTIVE_NOT_A_BOOLEAN: {
        send_data: {
          isActive: 'a',
        },
        expected: {
          message: ['isActive must be a boolean value'],
          ...defaultExpected,
        },
      },
    };
  }

  static arrangeForEntityValidationError() {
    const faker = AnimalCategory.fake().aAnimalCategory();
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      NAME_TOO_LONG: {
        send_data: {
          name: faker.withInvalidNameTooLong().name,
        },
        expected: {
          message: ['name must be shorter than or equal to 255 characters'],
          ...defaultExpected,
        },
      },
    };
  }
}

export class ListAnimalCategoriesFixture {
  static arrangeIncrementedWithCreatedAt() {
    const _entities = AnimalCategory.fake()
      .theCategories(4)
      .withName((i) => i + '')
      .withCreatedAt((i) => new Date(new Date().getTime() + i * 2000))
      .build();

    const entitiesMap = {
      first: _entities[0],
      second: _entities[1],
      third: _entities[2],
      fourth: _entities[3],
    };

    const arrange = [
      {
        send_data: {},
        expected: {
          entities: [
            entitiesMap.fourth,
            entitiesMap.third,
            entitiesMap.second,
            entitiesMap.first,
          ],
          meta: {
            current_page: 1,
            last_page: 1,
            per_page: 15,
            total: 4,
          },
        },
      },
      {
        send_data: {
          page: 1,
          per_page: 2,
        },
        expected: {
          entities: [entitiesMap.fourth, entitiesMap.third],
          meta: {
            current_page: 1,
            last_page: 2,
            per_page: 2,
            total: 4,
          },
        },
      },
      {
        send_data: {
          page: 2,
          per_page: 2,
        },
        expected: {
          entities: [entitiesMap.second, entitiesMap.first],
          meta: {
            current_page: 2,
            last_page: 2,
            per_page: 2,
            total: 4,
          },
        },
      },
    ];

    return { arrange, entitiesMap };
  }

  static arrangeUnsorted() {
    const faker = AnimalCategory.fake().aAnimalCategory();

    const entitiesMap = {
      a: faker.withName('a').build(),
      AAA: faker.withName('AAA').build(),
      AaA: faker.withName('AaA').build(),
      b: faker.withName('b').build(),
      c: faker.withName('c').build(),
    };

    const arrange = [
      {
        send_data: {
          page: 1,
          per_page: 2,
          sort: 'name',
          filter: 'a',
        },
        expected: {
          entities: [entitiesMap.AAA, entitiesMap.AaA],
          meta: {
            total: 3,
            current_page: 1,
            last_page: 2,
            per_page: 2,
          },
        },
      },
      {
        send_data: {
          page: 2,
          per_page: 2,
          sort: 'name',
          filter: 'a',
        },
        expected: {
          entities: [entitiesMap.a],
          meta: {
            total: 3,
            current_page: 2,
            last_page: 2,
            per_page: 2,
          },
        },
      },
    ];

    return { arrange, entitiesMap };
  }
}
