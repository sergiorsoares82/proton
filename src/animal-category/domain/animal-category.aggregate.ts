import { Uuid } from "../../shared/domain/value-object/uuid.vo";
import { AnimalCategoryValidatorFactory } from "./animal-category.validator";
import type { Gender } from "./animal.aggregate";

type AnimalCategoryConstructorProps = {
  animalCategoryId?: Uuid;
  name: string;
  gender: Gender;
  isActive?: boolean;
};

type AnimalCategoryCreateCommand = {
  name: string;
  gender: Gender;
  isActive?: boolean;
};

export class AnimalCategory {
  animalCategoryId: Uuid;
  name: string;
  gender: Gender;
  isActive: boolean;

  constructor(props: AnimalCategoryConstructorProps) {
    this.animalCategoryId = props.animalCategoryId ?? new Uuid();
    this.name = props.name;
    this.gender = props.gender;
    this.isActive = props.isActive ?? true;
  }

  static create(props: AnimalCategoryCreateCommand): AnimalCategory {
    const animalCategory = new AnimalCategory(props);
    AnimalCategory.validate(animalCategory);
    return animalCategory;
  }

  changeName(name: string): void {
    this.name = name;
    AnimalCategory.validate(this);
  }

  activate(): void {
    this.isActive = true;
  }

  deactivate(): void {
    this.isActive = false;
  }

  static validate(entity: AnimalCategory) {
    const validator = AnimalCategoryValidatorFactory.create();
    return validator.validate(entity);
  }

  toJSON() {
    return {
      animalCategoryId: this.animalCategoryId.id,
      name: this.name,
      gender: this.gender,
      isActive: this.isActive,
    };
  }
}
