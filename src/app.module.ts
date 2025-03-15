import { Module } from '@nestjs/common';
import { AnimalCategoriesModule } from './animal-categories/animal-categories.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, AnimalCategoriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
