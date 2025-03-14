import {
  PaginationOutputMapper,
  type PaginationOutput,
} from "../../../shared/application/pagination-output";
import type { IUseCase } from "../../../shared/application/use-case.interface";
import type { SortDirection } from "../../../shared/domain/repository/search-params";
import {
  AnimalCategorySearchParams,
  type AnimalCategoryFilter,
  type AnimalCategorySearchResult,
  type IAnimalCategoryRepository,
} from "../../domain/animal-category.repository";
import {
  AnimalCategoryOutputMapper,
  type AnimalCategoryOutput,
} from "./common/animal-category.output";

export class ListAnimalCategoriesUseCase
  implements
    IUseCase<ListAnimalCategoriesInput, PaginationOutput<AnimalCategoryOutput>>
{
  constructor(
    private readonly animalCategoryRepository: IAnimalCategoryRepository
  ) {}

  async execute(
    input: ListAnimalCategoriesInput
  ): Promise<PaginationOutput<AnimalCategoryOutput>> {
    const params = new AnimalCategorySearchParams(input);
    const searchResult = await this.animalCategoryRepository.search(params);

    return this.toOutput(searchResult);
  }

  private toOutput(
    searchResult: AnimalCategorySearchResult
  ): ListAnimalCategoriesOutput {
    const { items: _items } = searchResult;
    const items = _items.map((i) => {
      return AnimalCategoryOutputMapper.toOutput(i);
    });
    return PaginationOutputMapper.toOutput(items, searchResult);
  }
}

export type ListAnimalCategoriesInput = {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: SortDirection | null;
  filter?: AnimalCategoryFilter | null;
};

export type ListAnimalCategoriesOutput = PaginationOutput<AnimalCategoryOutput>;
