import {
  MaxLength,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsEnum,
} from "class-validator";
import { ClassValidatorFields } from "../../shared/domain/validators/class-validator-fields";
import { Gender } from "./animal.aggregate";
import type { AnimalCategory } from "./animal-category.aggregate";

export class AnimalCategoryRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(Gender, { message: "Gender must be either 'M' or 'F'" })
  @IsNotEmpty()
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

export class AnimalCategoryValidatorFactory {
  static create() {
    return new AnimalCategoryValidator();
  }
}
