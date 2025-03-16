import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from 'src/nest-modules/config-module/config.module';
import { DatabaseModule } from '../database-module/database.module';
import { AnimalCategoriesController } from './animal-categories.controller';
import { AnimalCategoriesModule } from './animal-categories.module';

describe('AnimalCategoriesController', () => {
  let controller: AnimalCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({}),
        DatabaseModule,
        AnimalCategoriesModule,
      ],
    }).compile();

    controller = module.get<AnimalCategoriesController>(
      AnimalCategoriesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
