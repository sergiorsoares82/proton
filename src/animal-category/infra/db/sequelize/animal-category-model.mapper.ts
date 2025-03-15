import { EntityValidationError } from "../../../../shared/domain/validators/validation.error";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { AnimalCategory } from "../../../domain/animal-category.aggregate";
import { AnimalCategoryModel } from "./animal-category.model";

export class AnimalCategoryModelMapper {
  static toModel(entity: AnimalCategory): AnimalCategoryModel {
    return AnimalCategoryModel.build({
      animalCategoryId: entity.animalCategoryId.id,
      name: entity.name,
      gender: entity.gender,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
    });
  }

  static toEntity(model: AnimalCategoryModel): AnimalCategory {
    const animalCategory = new AnimalCategory({
      animalCategoryId: new Uuid(model.animalCategoryId),
      name: model.name,
      gender: model.gender,
      isActive: model.isActive,
      createdAt: model.createdAt,
    });

    animalCategory.validate();

    if (animalCategory.notification.hasErrors()) {
      throw new EntityValidationError(animalCategory.notification.toJSON());
    }
    return animalCategory;
  }
}
