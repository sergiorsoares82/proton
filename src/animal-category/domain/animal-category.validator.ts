import {
  MaxLength,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
} from "class-validator";
import { ClassValidatorFields } from "../../shared/domain/validators/class-validator-fields";
import type { Gender } from "./animal.aggregate";
import type { AnimalCategory } from "./animal-category.aggregate";

export class AnimalCategoryRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  gender: Gender;

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;

  constructor({ name, gender, isActive }: AnimalCategory) {
    this.name = name;
    this.gender = gender;
    this.isActive = isActive;
  }
}

export class AnimalCategoryValidator extends ClassValidatorFields<AnimalCategoryRules> {
  validate(entity: AnimalCategory) {
    return super.validate(new AnimalCategoryRules(entity));
  }
}

export class CategoryValidatorFactory {
  static create() {
    return new AnimalCategoryValidator();
  }
}
