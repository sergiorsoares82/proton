import type { IUseCase } from "../../../../shared/application/use-case.interface";
import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { AnimalCategory } from "../../../domain/animal-category.aggregate";
import type { IAnimalCategoryRepository } from "../../../domain/animal-category.repository";
import type { Gender } from "../../../domain/animal.aggregate";
import { AnimalCategoryOutputMapper } from "../common/animal-category.output";

export class UpdateAnimalCategoryUseCase
  implements IUseCase<UpdateAnimalCategoryInput, UpdateAnimalCategoryOutput>
{
  constructor(
    private readonly animalCategoryRepository: IAnimalCategoryRepository
  ) {}

  async execute(
    input: UpdateAnimalCategoryInput
  ): Promise<UpdateAnimalCategoryOutput> {
    const uuid = new Uuid(input.animalCategoryId);
    const animalCategory = await this.animalCategoryRepository.findById(uuid);

    if (!animalCategory) {
      throw new NotFoundError(input.animalCategoryId, AnimalCategory);
    }

    input.name && animalCategory.changeName(input.name);

    if ("gender" in input) {
      animalCategory.changeGender(input.gender);
    }

    if (input.isActive !== undefined) {
      input.isActive ? animalCategory.activate() : animalCategory.deactivate();
    }

    await this.animalCategoryRepository.update(animalCategory);

    return AnimalCategoryOutputMapper.toOutput(animalCategory);
  }
}

export type UpdateAnimalCategoryInput = {
  animalCategoryId: string;
  name?: string;
  gender?: Gender;
  isActive?: boolean;
};

export type UpdateAnimalCategoryOutput = {
  animalCategoryId: string;
  name: string;
  gender: Gender;
  isActive: boolean;
  createdAt: Date;
};
