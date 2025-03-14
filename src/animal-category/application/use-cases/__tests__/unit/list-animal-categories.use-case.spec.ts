import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import {
  InvalidUuidError,
  Uuid,
} from "../../../../../shared/domain/value-objects/uuid.vo";
import { AnimalCategory } from "../../../../domain/animal-category.aggregate";
import { AnimalCategorySearchResult } from "../../../../domain/animal-category.repository";
import { Gender } from "../../../../domain/animal.aggregate";
import { AnimalCategoryInMemoryRepository } from "../../../../infra/db/in-memory/animal-category-in-memory.repository";
import { AnimalCategoryOutputMapper } from "../../common/animal-category.output";
import { ListAnimalCategoriesUseCase } from "../../list-animal-categories.use-case";
import { UpdateAnimalCategoryUseCase } from "../../update-animal-category.use-case";

describe("List Animal Categories Use Case Unit Test", () => {
  let useCase: ListAnimalCategoriesUseCase;
  let repository: AnimalCategoryInMemoryRepository;

  beforeEach(() => {
    repository = new AnimalCategoryInMemoryRepository();
    useCase = new ListAnimalCategoriesUseCase(repository);
  });

  test("toOutput method", () => {
    let result = new AnimalCategorySearchResult({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
    });
    let output = useCase["toOutput"](result);
    expect(output).toStrictEqual({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
      last_page: 1,
    });

    const entity = AnimalCategory.create({
      name: "Movie",
      gender: Gender.FEMALE,
    });
    result = new AnimalCategorySearchResult({
      items: [entity],
      total: 1,
      current_page: 1,
      per_page: 2,
    });

    output = useCase["toOutput"](result);
    expect(output).toStrictEqual({
      items: [entity].map(AnimalCategoryOutputMapper.toOutput),
      total: 1,
      current_page: 1,
      per_page: 2,
      last_page: 1,
    });
  });

  it("should return output sorted by createdAt when input param is empty", async () => {
    const items = [
      new AnimalCategory({ name: "test 1", gender: Gender.FEMALE }),
      new AnimalCategory({
        name: "test 2",
        gender: Gender.FEMALE,
        createdAt: new Date(new Date().getTime() + 100),
      }),
    ];
    repository.items = items;

    const output = await useCase.execute({});
    expect(output).toStrictEqual({
      items: [...items].reverse().map(AnimalCategoryOutputMapper.toOutput),
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });

  it("should return output using pagination, sort and filter", async () => {
    const items = [
      new AnimalCategory({ name: "a", gender: Gender.FEMALE }),
      new AnimalCategory({
        name: "AAA",
        gender: Gender.FEMALE,
      }),
      new AnimalCategory({
        name: "AaA",
        gender: Gender.FEMALE,
      }),
      new AnimalCategory({
        name: "b",
        gender: Gender.FEMALE,
      }),
      new AnimalCategory({
        name: "c",
        gender: Gender.FEMALE,
      }),
    ];
    repository.items = items;

    let output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      filter: "a",
    });
    expect(output).toStrictEqual({
      items: [items[1], items[2]].map(AnimalCategoryOutputMapper.toOutput),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({
      page: 2,
      per_page: 2,
      sort: "name",
      filter: "a",
    });
    expect(output).toStrictEqual({
      items: [items[0]].map(AnimalCategoryOutputMapper.toOutput),
      total: 3,
      current_page: 2,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      sort_dir: "desc",
      filter: "a",
    });
    expect(output).toStrictEqual({
      items: [items[0], items[2]].map(AnimalCategoryOutputMapper.toOutput),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });
  });
});
