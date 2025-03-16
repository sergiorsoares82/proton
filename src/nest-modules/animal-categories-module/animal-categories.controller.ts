import { AnimalCategorySequelizeRepository } from '@core/animal-category/infra/db/sequelize/animal-category-sequelize.repository';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Injectable,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateAnimalCategoryDto } from './dto/create-animal-category.dto';
import { UpdateAnimalCategoryDto } from './dto/update-animal-category.dto';

@Controller('animal-categories')
export class AnimalCategoriesController {
  constructor(
    @Inject(AnimalCategorySequelizeRepository)
    private readonly animalCategorySequelizeRepository: AnimalCategorySequelizeRepository,
  ) {}

  @Post()
  create(@Body() createAnimalCategoryDto: CreateAnimalCategoryDto) {}

  @Get()
  findAll() {}

  @Get(':id')
  findOne(@Param('id') id: string) {}

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAnimalCategoryDto: UpdateAnimalCategoryDto,
  ) {}

  @Delete(':id')
  remove(@Param('id') id: string) {}
}
