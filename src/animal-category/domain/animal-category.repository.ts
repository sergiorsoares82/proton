import { IRepository } from "../../shared/domain/repository/repository-interface";
import type { Uuid } from "../../shared/domain/value-objects/uuid.vo";
import type { AnimalCategory } from "./animal-category.aggregate";

export interface IAnimalCategoryRepository
  extends IRepository<AnimalCategory, Uuid> {}
