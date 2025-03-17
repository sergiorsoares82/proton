import { AnimalCategory } from '@core/animal-category/domain/animal-category.aggregate';
import { Gender } from '@core/animal-category/domain/animal.aggregate';

const _keysInResponse = [
  'animalCategoryId',
  'name',
  'gender',
  'isActive',
  'createdAt',
];

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
    ];
  }
}
