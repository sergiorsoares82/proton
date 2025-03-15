import { IsEnum, MaxLength } from "class-validator";
import { ClassValidatorFields } from "../../shared/domain/validators/class-validator-fields";
import type { AnimalCategory } from "./animal-category.aggregate";
import { Gender } from "./animal.aggregate";
import type { Notification } from "../../shared/domain/validators/notification";

export class AnimalCategoryRules {
  @MaxLength(255, { groups: ["name"] })
  name: string;

  @IsEnum(Gender, {
    // message: "Gender must be either 'M' or 'F'",
    groups: ["gender"],
  })
  gender: Gender;

  constructor({ name, gender }: AnimalCategory) {
    this.name = name;
    this.gender = gender;
  }
}

export class AnimalCategoryValidator extends ClassValidatorFields {
  validate(notification: Notification, data: any, fields?: string[]): boolean {
    const newFields = fields?.length ? fields : ["name", "gender"];
    return super.validate(
      notification,
      new AnimalCategoryRules(data),
      newFields
    );
  }
}

export class AnimalCategoryValidatorFactory {
  static create() {
    return new AnimalCategoryValidator();
  }
}
