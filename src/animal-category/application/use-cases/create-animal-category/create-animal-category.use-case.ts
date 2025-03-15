import type { IUseCase } from "../../../../shared/application/use-case.interface";
import { AnimalCategory } from "../../../domain/animal-category.aggregate";
import type { IAnimalCategoryRepository } from "../../../domain/animal-category.repository";
import type { Gender } from "../../../domain/animal.aggregate";
import { AnimalCategoryOutputMapper } from "../common/animal-category.output";

export class CreateAnimalCategoryUseCase
  implements IUseCase<CreateAnimalCategoryInput, CreateAnimalCategoryOutput>
{
  constructor(private readonly animalCategoryRepo: IAnimalCategoryRepository) {}

  async execute(
    input: CreateAnimalCategoryInput
  ): Promise<CreateAnimalCategoryOutput> {
    const entity = AnimalCategory.create(input);

    await this.animalCategoryRepo.insert(entity);

    return AnimalCategoryOutputMapper.toOutput(entity);
  }
}

export type CreateAnimalCategoryInput = {
  name: string;
  gender: Gender;
  isActive?: boolean;
};

export type CreateAnimalCategoryOutput = {
  animalCategoryId: string;
  name: string;
  gender: Gender;
  isActive: boolean;
  createdAt: Date;
};
