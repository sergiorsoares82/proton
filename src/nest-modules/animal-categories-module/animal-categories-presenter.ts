import { Transform } from 'class-transformer';
import type { AnimalCategoryOutput } from '@core/animal-category/application/use-cases/common/animal-category.output';
import type { ListAnimalCategoriesOutput } from '@core/animal-category/application/use-cases/list-animal-category/list-animal-categories.use-case';
import { CollectionPresenter } from 'src/shared-module/collection.presenter';

export class AnimalCategoryPresenter {
  animalCategoryId: string;
  name: string;
  gender: string;
  isActive: boolean;
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date;

  constructor(output: AnimalCategoryOutput) {
    this.animalCategoryId = output.animalCategoryId;
    this.name = output.name;
    this.gender = output.gender;
    this.isActive = output.isActive;
    this.createdAt = output.createdAt;
  }
}

export class AnimalCategoryCollectionPresenter extends CollectionPresenter {
  data: AnimalCategoryPresenter[];

  constructor(output: ListAnimalCategoriesOutput) {
    const { items, ...paginationProps } = output;
    super(paginationProps);
    this.data = items.map((i) => new AnimalCategoryPresenter(i));
  }
}
