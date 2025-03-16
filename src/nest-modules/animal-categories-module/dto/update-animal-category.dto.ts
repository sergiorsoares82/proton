import { PartialType } from '@nestjs/mapped-types';
import { CreateAnimalCategoryDto } from './create-animal-category.dto';

export class UpdateAnimalCategoryDto extends PartialType(CreateAnimalCategoryDto) {}
