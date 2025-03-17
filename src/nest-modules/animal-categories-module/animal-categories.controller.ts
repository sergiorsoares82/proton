import { AnimalCategorySequelizeRepository } from '@core/animal-category/infra/db/sequelize/animal-category-sequelize.repository';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Injectable,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateAnimalCategoryDto } from './dto/create-animal-category.dto';
import { UpdateAnimalCategoryDto } from './dto/update-animal-category.dto';
import { CreateAnimalCategoryUseCase } from '@core/animal-category/application/use-cases/create-animal-category/create-animal-category.use-case';
import { UpdateAnimalCategoryUseCase } from '@core/animal-category/application/use-cases/update-animal-category/update-animal-category.use-case';
import { DeleteAnimalCategoryUseCase } from '@core/animal-category/application/use-cases/delete-animal-category/delete-animal-category.use-case';
import { GetAnimalCategoryUseCase } from '@core/animal-category/application/use-cases/get-animal-category/get-animal-category.use-case';
import { ListAnimalCategoriesUseCase } from '@core/animal-category/application/use-cases/list-animal-category/list-animal-categories.use-case';
import type { AnimalCategoryOutput } from '@core/animal-category/application/use-cases/common/animal-category.output';
import {
  AnimalCategoryCollectionPresenter,
  AnimalCategoryPresenter,
} from './animal-categories-presenter';
import type { SearchAnimalCategoriesDto } from './dto/search-animal-categories.dto';

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
  async create(@Body() createAnimalCategoryDto: CreateAnimalCategoryDto) {
    const output = await this.createUseCase.execute(createAnimalCategoryDto);
    return AnimalCategoriesController.serialize(output);
  }

  @Get()
  async search(@Query() searchParamsDto: SearchAnimalCategoriesDto) {
    const output = await this.listUseCase.execute(searchParamsDto);
    return new AnimalCategoryCollectionPresenter(output);
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 }))
    animalCategoryId: string,
  ) {
    const output = await this.getUseCase.execute({ animalCategoryId });

    return AnimalCategoriesController.serialize(output);
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 }))
    animalCategoryId: string,
    @Body() updateAnimalCategoryDto: UpdateAnimalCategoryDto,
  ) {
    const output = await this.updateUseCase.execute({
      animalCategoryId,
      ...updateAnimalCategoryDto,
    });

    return AnimalCategoriesController.serialize(output);
  }

  @HttpCode(204)
  @Delete(':id')
  async remove(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 }))
    animalCategoryId: string,
  ) {
    return this.deleteUseCase.execute({ animalCategoryId });
  }

  static serialize(output: AnimalCategoryOutput) {
    return new AnimalCategoryPresenter(output);
  }
}
