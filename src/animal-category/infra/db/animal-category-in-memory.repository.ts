import { InMemoryRepository } from "../../../shared/infra/db/in-memory/in-memory.repository";
import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { AnimalCategory } from "../../domain/animal-category.aggregate";

export class AnimalCategoryInMemoryRepository extends InMemoryRepository<
  AnimalCategory,
  Uuid
> {
  getEntity(): new (...args: any[]) => AnimalCategory {
    return AnimalCategory;
  }
}
