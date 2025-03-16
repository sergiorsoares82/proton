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
import { CreateAnimalCategoryUseCase } from '@core/animal-category/application/use-cases/create-animal-category/create-animal-category.use-case';
import { UpdateAnimalCategoryUseCase } from '@core/animal-category/application/use-cases/update-animal-category/update-animal-category.use-case';
import { DeleteAnimalCategoryUseCase } from '@core/animal-category/application/use-cases/delete-animal-category/delete-animal-category.use-case';
import { GetAnimalCategoryUseCase } from '@core/animal-category/application/use-cases/get-animal-category/get-animal-category.use-case';
import { ListAnimalCategoriesUseCase } from '@core/animal-category/application/use-cases/list-animal-category/list-animal-categories.use-case';
import type { AnimalCategoryOutput } from '@core/animal-category/application/use-cases/common/animal-category.output';
import { AnimalCategoryPresenter } from './animal-categories-presenter';

@Controller('animal-categories')
export class AnimalCategoriesController {
  @Inject(CreateAnimalCategoryUseCase)
  private createUseCase: CreateAnimalCategoryUseCase;

  @Inject(UpdateAnimalCategoryUseCase)
  private updateUseCase: UpdateAnimalCategoryUseCase;

  @Inject(DeleteAnimalCategoryUseCase)
  private deleteUseCase: DeleteAnimalCategoryUseCase;

  @Inject(GetAnimalCategoryUseCase)
  private getUseCase: GetAnimalCategoryUseCase;

  @Inject(ListAnimalCategoriesUseCase)
  private listUseCase: ListAnimalCategoriesUseCase;

  @Post()
  create(@Body() createAnimalCategoryDto: CreateAnimalCategoryDto) {
    return this.createUseCase.execute(createAnimalCategoryDto);
  }

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

  static serialize(output: AnimalCategoryOutput) {
    return new AnimalCategoryPresenter(output);
  }
}
