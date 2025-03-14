import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";
import { AnimalCategory } from "../../../../domain/animal-category.aggregate";
import { Gender } from "../../../../domain/animal.aggregate";
import { AnimalCategorySequelizeRepository } from "../../../../infra/db/sequelize/animal-category-sequelize.repository";
import { AnimalCategoryModel } from "../../../../infra/db/sequelize/animal-category.model";
import { AnimalCategoryOutputMapper } from "../../common/animal-category.output";
import { ListAnimalCategoriesUseCase } from "../../list-animal-categories.use-case";
import { UpdateAnimalCategoryUseCase } from "../../update-animal-category.use-case";

describe("List Animal Categories Use Case Integration Tests", () => {
  let useCase: ListAnimalCategoriesUseCase;
  let repository: AnimalCategorySequelizeRepository;

  setupSequelize({ models: [AnimalCategoryModel] });

  beforeEach(() => {
    repository = new AnimalCategorySequelizeRepository(AnimalCategoryModel);
    useCase = new ListAnimalCategoriesUseCase(repository);
  });

  it("should return output sorted by created_at when input param is empty", async () => {
    const categories = AnimalCategory.fake()
      .theCategories(2)
      .withCreatedAt((i) => new Date(new Date().getTime() + 1000 + i))
      .build();

    await repository.bulkInsert(categories);
    const output = await useCase.execute({});
    expect(output).toEqual({
      items: [...categories].reverse().map(AnimalCategoryOutputMapper.toOutput),
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });

  it("should returns output using pagination, sort and filter", async () => {
    const categories = [
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
    await repository.bulkInsert(categories);

    let output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      filter: "a",
    });
    expect(output).toEqual({
      items: [categories[1], categories[2]].map(
        AnimalCategoryOutputMapper.toOutput
      ),
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
    expect(output).toEqual({
      items: [categories[0]].map(AnimalCategoryOutputMapper.toOutput),
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
    expect(output).toEqual({
      items: [categories[0], categories[2]].map(
        AnimalCategoryOutputMapper.toOutput
      ),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });
  });
});
