import { Module } from '@nestjs/common';
import { AnimalCategoriesModule } from './nest-modules/animal-categories-module/animal-categories.module';
import { ConfigModule } from './nest-modules/config-module/config.module';
import { SharedModule } from './nest-modules/shared-module/shared.module';
import { DatabaseModule } from './nest-modules/database-module/database.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    AnimalCategoriesModule,
    SharedModule,
  ],
})
export class AppModule {}
