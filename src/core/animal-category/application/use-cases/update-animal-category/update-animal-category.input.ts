import { Gender } from '@core/animal-category/domain/animal.aggregate';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

export type UpdateAnimalCategoryInputConstructorProps = {
  animalCategoryId: string;
  name?: string;
  gender?: string;
  isActive?: boolean;
};

export class UpdateAnimalCategoryInput {
  @IsString()
  @IsNotEmpty()
  animalCategoryId: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  constructor(props?: UpdateAnimalCategoryInputConstructorProps) {
    if (!props) return;
    this.animalCategoryId = props.animalCategoryId;
    props.name && (this.name = props.name);
    props.gender && (this.gender = props.gender);
    props.isActive !== null &&
      props.isActive !== undefined &&
      (this.isActive = props.isActive);
  }
}

export class ValidateUpdateAnimalCategoryInput {
  static validate(input: UpdateAnimalCategoryInput) {
    return validateSync(input);
  }
}
