import type { AnimalCategory } from "../../../domain/animal-category.aggregate";
import type { Gender } from "../../../domain/animal.aggregate";

export type AnimalCategoryOutput = {
  animalCategoryId: string;
  name: string;
  gender: Gender;
  isActive: boolean;
  createdAt: Date;
};

export class AnimalCategoryOutputMapper {
  static toOutput(entity: AnimalCategory): AnimalCategoryOutput {
    return entity.toJSON();
  }
}
