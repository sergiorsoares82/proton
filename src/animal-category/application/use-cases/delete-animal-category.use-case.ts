import type { IUseCase } from "../../../shared/application/use-case.interface";
import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import type { IAnimalCategoryRepository } from "../../domain/animal-category.repository";

export class DeleteAnimalCategoryUseCase
  implements IUseCase<DeleteAnimalCategoryInput, DeleteAnimalCategoryOutput>
{
  constructor(private readonly animalCategoryRepo: IAnimalCategoryRepository) {}

  async execute(
    input: DeleteAnimalCategoryInput
  ): Promise<DeleteAnimalCategoryOutput> {
    const uuid = new Uuid(input.animalCategoryId);
    await this.animalCategoryRepo.delete(uuid);
  }
}

export type DeleteAnimalCategoryInput = {
  animalCategoryId: string;
};

type DeleteAnimalCategoryOutput = void;
