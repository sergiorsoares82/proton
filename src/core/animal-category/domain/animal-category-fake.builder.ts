import Chance from "chance";
import { Uuid } from "../../shared/domain/value-objects/uuid.vo";
import { AnimalCategory } from "./animal-category.aggregate";
import { Gender } from "./animal.aggregate";

type PropOrFactory<T> = T | ((index: number) => T);

export class AnimalCategoryFakeBuilder<
  TBuild extends AnimalCategory | AnimalCategory[] = AnimalCategory,
> {
  // auto generated in entity
  private _animalCategoryId: PropOrFactory<Uuid> | undefined = undefined;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _name: PropOrFactory<string> = (_index) => this.chance.word();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _gender: PropOrFactory<Gender> = (_index) =>
    this.chance.pickone([Gender.MALE, Gender.FEMALE]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _isActive: PropOrFactory<boolean> = (_index) => true;
  // auto generated in entity
  private _createdAt: PropOrFactory<Date> | undefined = undefined;

  private countObjs;

  static aAnimalCategory() {
    return new AnimalCategoryFakeBuilder<AnimalCategory>();
  }

  static theCategories(countObjs: number) {
    return new AnimalCategoryFakeBuilder<AnimalCategory[]>(countObjs);
  }

  private chance: Chance.Chance;

  private constructor(countObjs: number = 1) {
    this.countObjs = countObjs;
    this.chance = Chance();
  }

  withUuid(valueOrFactory: PropOrFactory<Uuid>) {
    this._animalCategoryId = valueOrFactory;
    return this;
  }

  withName(valueOrFactory: PropOrFactory<string>) {
    this._name = valueOrFactory;
    return this;
  }

  withGender(valueOrFactory: PropOrFactory<Gender>) {
    this._gender = valueOrFactory;
    return this;
  }

  activate() {
    this._isActive = true;
    return this;
  }

  deactivate() {
    this._isActive = false;
    return this;
  }

  withCreatedAt(valueOrFactory: PropOrFactory<Date>) {
    this._createdAt = valueOrFactory;
    return this;
  }

  withInvalidNameTooLong(value?: string) {
    this._name = value ?? this.chance.word({ length: 256 });
    return this;
  }

  build(): TBuild {
    const animalCategories = new Array(this.countObjs)
      .fill(undefined)
      .map((_, index) => {
        const animalCategory = new AnimalCategory({
          animalCategoryId: !this._animalCategoryId
            ? undefined
            : this.callFactory(this._animalCategoryId, index),
          name: this.callFactory(this._name, index),
          gender: this.callFactory(this._gender, index),
          isActive: this.callFactory(this._isActive, index),
          ...(this._createdAt && {
            createdAt: this.callFactory(this._createdAt, index),
          }),
        });
        animalCategory.validate();
        return animalCategory;
      });
    return (
      this.countObjs === 1 ? animalCategories[0] : animalCategories
    ) as TBuild;
  }

  get animalCategoryId() {
    return this.getValue("animalCategoryId");
  }

  get name() {
    return this.getValue("name");
  }

  get gender() {
    return this.getValue("gender");
  }

  get isActive() {
    return this.getValue("isActive");
  }

  get createdAt() {
    return this.getValue("createdAt");
  }

  private getValue(prop: any) {
    const optional = ["animalCategoryId", "createdAt"];
    const privateProp = `_${prop}` as keyof this;
    if (!this[privateProp] && optional.includes(prop)) {
      throw new Error(
        `Property ${prop} does not have a factory, use 'with' methods`
      );
    }
    return this.callFactory(this[privateProp], 0);
  }

  private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
    return typeof factoryOrValue === "function"
      ? factoryOrValue(index)
      : factoryOrValue;
  }
}
