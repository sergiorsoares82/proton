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
    const entity = new AnimalCategory({
      animalCategoryId: new Uuid(model.animalCategoryId),
      name: model.name,
      gender: model.gender,
      isActive: model.isActive,
      createdAt: model.createdAt,
    });

    AnimalCategory.validate(entity);
    return entity;
  }
}
