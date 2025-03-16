import type { IUseCase } from '../../../../shared/application/use-case.interface';
import { AnimalCategory } from '../../../domain/animal-category.aggregate';
import type { IAnimalCategoryRepository } from '../../../domain/animal-category.repository';
import type { Gender } from '../../../domain/animal.aggregate';
import {
  AnimalCategoryOutputMapper,
  type AnimalCategoryOutput,
} from '../common/animal-category.output';
import type { CreateAnimalCategoryInput } from './create-animal-category.input';

export class CreateAnimalCategoryUseCase
  implements IUseCase<CreateAnimalCategoryInput, CreateAnimalCategoryOutput>
{
  constructor(private readonly animalCategoryRepo: IAnimalCategoryRepository) {}

  async execute(
    input: CreateAnimalCategoryInput,
  ): Promise<CreateAnimalCategoryOutput> {
    const entity = AnimalCategory.create(input);

    await this.animalCategoryRepo.insert(entity);

    return AnimalCategoryOutputMapper.toOutput(entity);
  }
}

export type CreateAnimalCategoryOutput = AnimalCategoryOutput;
