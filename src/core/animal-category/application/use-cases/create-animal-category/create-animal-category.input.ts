import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  validateSync,
} from "class-validator";

export type CreateAnimalCategoryInputConstructorProps = {
  name: string;
  gender: string;
  isActive?: boolean;
};

export class CreateAnimalCategoryInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  gender?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  constructor(props: CreateAnimalCategoryInputConstructorProps) {
    if (!props) return;
    this.name = props.name;
    this.gender = props.gender;
    this.isActive = props.isActive;
  }
}

export class ValidateCreateAnimalCategoryInput {
  static validate(input: CreateAnimalCategoryInput) {
    return validateSync(input);
  }
}
