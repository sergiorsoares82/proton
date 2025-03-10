import { Uuid } from "../../shared/domain/value-object/uuid.vo";
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
    return new AnimalCategory(props);
  }

  changeName(name: string): void {
    this.name = name;
  }

  activate(): void {
    this.isActive = true;
  }

  deactivate(): void {
    this.isActive = false;
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
