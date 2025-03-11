import { InMemorySearchableRepository } from "../../../shared/infra/db/in-memory/in-memory.repository";
import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { AnimalCategory } from "../../domain/animal-category.aggregate";
import type { SortDirection } from "../../../shared/domain/repository/search-params";

export class AnimalCategoryInMemoryRepository extends InMemorySearchableRepository<
  AnimalCategory,
  Uuid
> {
  sortableFields: string[] = ["name", "created_at"];

  protected async applyFilter(
    items: AnimalCategory[],
    filter: string
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
      : super.applySort(items, "created_at", "desc");
  }

  getEntity(): new (...args: any[]) => AnimalCategory {
    return AnimalCategory;
  }
}
