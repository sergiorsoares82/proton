import { type ISearchableRepository } from "../../shared/domain/repository/repository-interface";
import { SearchParams } from "../../shared/domain/repository/search-params";
import { SearchResult } from "../../shared/domain/repository/search-result";
import type { Uuid } from "../../shared/domain/value-objects/uuid.vo";
import type { AnimalCategory } from "./animal-category.aggregate";

export type AnimalCategoryFilter = string;

export class AnimalCategorySearchParams extends SearchParams<AnimalCategoryFilter> {}

export class AnimalCategorySearchResult extends SearchResult<AnimalCategory> {}

export interface IAnimalCategoryRepository
  extends ISearchableRepository<
    AnimalCategory,
    Uuid,
    AnimalCategoryFilter,
    AnimalCategorySearchParams,
    AnimalCategorySearchResult
  > {}
