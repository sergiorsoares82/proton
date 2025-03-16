import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateAnimalCategoryDto } from './create-animal-category.dto';
import { UpdateAnimalCategoryInput } from '@core/animal-category/application/use-cases/update-animal-category/update-animal-category.input';

export class UpdateAnimalCategoryInputWithoutId extends OmitType(
  UpdateAnimalCategoryInput,
  ['animalCategoryId'] as const,
) {}

export class UpdateAnimalCategoryDto extends PartialType(
  CreateAnimalCategoryDto,
) {}
