import { Transform } from 'class-transformer';
import type { AnimalCategory } from './entities/animal-category.entity';
import type { AnimalCategoryOutput } from '@core/animal-category/application/use-cases/common/animal-category.output';

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
