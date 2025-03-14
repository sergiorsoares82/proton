import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import {
  InvalidUuidError,
  Uuid,
} from "../../../../../shared/domain/value-objects/uuid.vo";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";
import { AnimalCategory } from "../../../../domain/animal-category.aggregate";
import { Gender } from "../../../../domain/animal.aggregate";
import { AnimalCategoryInMemoryRepository } from "../../../../infra/db/in-memory/animal-category-in-memory.repository";
import { AnimalCategorySequelizeRepository } from "../../../../infra/db/sequelize/animal-category-sequelize.repository";
import { AnimalCategoryModel } from "../../../../infra/db/sequelize/animal-category.model";
import { GetAnimalCategoryUseCase } from "../../get-animal-category.use-case";

describe("Get Animal Category Use Case Integration Test", () => {
  let useCase: GetAnimalCategoryUseCase;
  let repository: AnimalCategorySequelizeRepository;

  setupSequelize({ models: [AnimalCategoryModel] });

  beforeEach(() => {
    repository = new AnimalCategorySequelizeRepository(AnimalCategoryModel);
    useCase = new GetAnimalCategoryUseCase(repository);
  });

  it("should throw an error when animal category is not found", async () => {
    await expect(() =>
      useCase.execute({ animalCategoryId: "fake id" })
    ).rejects.toThrow(new InvalidUuidError());

    const uuid = new Uuid();

    await expect(() =>
      useCase.execute({ animalCategoryId: uuid.id })
    ).rejects.toThrow(new NotFoundError(uuid.id, AnimalCategory));
  });

  it("should get an animal category", async () => {
    const animalCategory = AnimalCategory.fake().aAnimalCategory().build();
    await repository.insert(animalCategory);

    const output = await useCase.execute({
      animalCategoryId: animalCategory.animalCategoryId.id,
    });

    expect(output).toStrictEqual({
      animalCategoryId: animalCategory.animalCategoryId.id,
      name: animalCategory.name,
      gender: animalCategory.gender,
      isActive: true,
      createdAt: animalCategory.createdAt,
    });
  });
});
