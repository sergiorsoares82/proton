export type Gender = 'M' | 'F';

type AnimalConstructorProps = {
  animalId?: string;
  gender: Gender;
  number: string;
  shortName: string;
  fullName?: string;
  isActive?: boolean;
  createdAt?: Date;
};

type AnimalCreateCommand = {
  gender: Gender;
  number: string;
  shortName: string;
  fullName?: string;
  isActive?: boolean;
};

export class Animal {
  animalId: string;
  gender: Gender;
  number: string;
  shortName: string;
  fullName: string | null;
  isActive: boolean;
  createdAt: Date;

  constructor(props: AnimalConstructorProps) {
    this.animalId = props.animalId ?? "";
    this.gender = props.gender;
    this.number = props.number;
    this.shortName = props.shortName;
    this.fullName = props.fullName ?? null;
    this.isActive = props.isActive ?? true;
    this.createdAt = props.createdAt ?? new Date();
  }

  static create(props: AnimalCreateCommand): Animal {
    return new Animal(props);
  }

  changeFullName(fullName: string): Animal {
    return new Animal({ ...this, fullName });
  }

  toJSON() {
    return {
      animalId: this.animalId,
      gender: this.gender,
      number: this.number,
      shortName: this.shortName,
      fullName: this.fullName,
      isActive: this.isActive,
      createdAt: this.createdAt,
    };
  }
}
