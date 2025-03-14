import type { IUseCase } from "../../../shared/application/use-case.interface";
import { NotFoundError } from "../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { AnimalCategory } from "../../domain/animal-category.aggregate";
import type { IAnimalCategoryRepository } from "../../domain/animal-category.repository";
import type { Gender } from "../../domain/animal.aggregate";
import { AnimalCategoryOutputMapper } from "./common/animal-category.output";

export class GetAnimalCategoryUseCase
  implements IUseCase<GetAnimalCategoryInput, GetAnimalCategoryOutput>
{
  constructor(
    private readonly animalCategoryRepository: IAnimalCategoryRepository
  ) {}

  async execute(
    input: GetAnimalCategoryInput
  ): Promise<GetAnimalCategoryOutput> {
    const uuid = new Uuid(input.animalCategoryId);
    const category = await this.animalCategoryRepository.findById(uuid);
    if (!category) {
      throw new NotFoundError(input.animalCategoryId, AnimalCategory);
    }

    return AnimalCategoryOutputMapper.toOutput(category);
  }
}

export type GetAnimalCategoryInput = {
  animalCategoryId: string;
};

export type GetAnimalCategoryOutput = {
  animalCategoryId: string;
  name: string;
  gender: Gender;
  isActive: boolean;
  createdAt: Date;
};
