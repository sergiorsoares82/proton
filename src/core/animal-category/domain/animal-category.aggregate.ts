import { Entity } from '../../shared/domain/entity';
import { EntityValidationError } from '../../shared/domain/validators/validation.error';
import type { ValueObject } from '../../shared/domain/value-object';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { AnimalCategoryFakeBuilder } from './animal-category-fake.builder';
import { AnimalCategoryValidatorFactory } from './animal-category.validator';
import { Gender } from './animal.aggregate';

type AnimalCategoryConstructorProps = {
  animalCategoryId?: Uuid;
  name: string;
  gender: string;
  isActive?: boolean;
  createdAt?: Date;
};

type AnimalCategoryCreateCommand = {
  name: string;
  gender: string;
  isActive?: boolean;
};

export class AnimalCategory extends Entity {
  animalCategoryId: Uuid;
  name: string;
  gender: string;
  isActive: boolean;
  createdAt: Date;

  constructor(props: AnimalCategoryConstructorProps) {
    super();
    this.animalCategoryId = props.animalCategoryId ?? new Uuid();
    this.name = props.name;
    this.gender = props.gender;
    this.isActive = props.isActive ?? true;
    this.createdAt = props.createdAt ?? new Date();
  }

  static create(props: AnimalCategoryCreateCommand): AnimalCategory {
    const animalCategory = new AnimalCategory(props);
    animalCategory.validate(['name', 'gender']);
    return animalCategory;
  }

  changeName(name: string): void {
    this.name = name;
    this.validate(['name']);
  }

  changeGender(gender: string): void {
    this.gender = gender;
    // this.validate(["gender"]);
  }

  activate(): void {
    this.isActive = true;
  }

  deactivate(): void {
    this.isActive = false;
  }

  validate(fields?: string[]) {
    const validator = AnimalCategoryValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  get entityId(): ValueObject {
    return this.animalCategoryId;
  }

  static fake() {
    return AnimalCategoryFakeBuilder;
  }

  toJSON() {
    return {
      animalCategoryId: this.animalCategoryId.id,
      name: this.name,
      gender: this.gender,
      isActive: this.isActive,
      createdAt: this.createdAt,
    };
  }
}
