import { Module } from '@nestjs/common';
import { AnimalCategoriesModule } from './nest-modules/animal-categories-module/animal-categories.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './nest-modules/config-module/config.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, AnimalCategoriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
