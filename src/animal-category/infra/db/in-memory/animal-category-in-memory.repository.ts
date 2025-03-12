import { InMemorySearchableRepository } from "../../../../shared/infra/db/in-memory/in-memory.repository";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { AnimalCategory } from "../../../domain/animal-category.aggregate";
import type { SortDirection } from "../../../../shared/domain/repository/search-params";
import type {
  AnimalCategoryFilter,
  IAnimalCategoryRepository,
} from "../../../domain/animal-category.repository";

export class AnimalCategoryInMemoryRepository
  extends InMemorySearchableRepository<AnimalCategory, Uuid>
  implements IAnimalCategoryRepository
{
  sortableFields: string[] = ["name", "createdAt"];

  protected async applyFilter(
    items: AnimalCategory[],
    filter: AnimalCategoryFilter
  ): Promise<AnimalCategory[]> {
    if (!filter) {
      return items;
    }

    return items.filter((i) => {
      return i.name.toLowerCase().includes(filter.toLowerCase());
    });
  }

  protected applySort(
    items: AnimalCategory[],
    sort: string | null,
    sort_dir: SortDirection | null
  ) {
    return sort
      ? super.applySort(items, sort, sort_dir)
      : super.applySort(items, "createdAt", "desc");
  }

  getEntity(): new (...args: any[]) => AnimalCategory {
    return AnimalCategory;
  }
}
