import type { ListAnimalCategoriesInput } from '@core/animal-category/application/use-cases/list-animal-category/list-animal-categories.use-case';
import { SortDirection } from '../../../core/shared/domain/repository/search-params';

export class SearchAnimalCategoriesDto implements ListAnimalCategoriesInput {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: SortDirection;
  filter?: string;
}
