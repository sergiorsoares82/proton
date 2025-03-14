import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import {
  InvalidUuidError,
  Uuid,
} from "../../../../shared/domain/value-objects/uuid.vo";
import { setupSequelize } from "../../../../shared/infra/testing/helpers";
import { AnimalCategory } from "../../../domain/animal-category.aggregate";
import { Gender } from "../../../domain/animal.aggregate";
import { AnimalCategoryInMemoryRepository } from "../../../infra/db/in-memory/animal-category-in-memory.repository";
import { AnimalCategoryModel } from "../../../infra/db/sequelize/animal-category.model";
import { GetAnimalCategoryUseCase } from "../../get-animal-category.use-case";
import { UpdateAnimalCategoryUseCase } from "../../update-animal-category.use-case";

describe("Get Animal Category Use Case Unit Test", () => {
  let useCase: GetAnimalCategoryUseCase;
  let repository: AnimalCategoryInMemoryRepository;

  beforeEach(() => {
    repository = new AnimalCategoryInMemoryRepository();
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
    const items = [
      AnimalCategory.create({ name: "Movie", gender: Gender.FEMALE }),
    ];
    repository.items = items;
    const spyFindById = jest.spyOn(repository, "findById");
    const output = await useCase.execute({
      animalCategoryId: items[0].animalCategoryId.id,
    });
    expect(spyFindById).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      animalCategoryId: items[0].animalCategoryId.id,
      name: "Movie",
      gender: Gender.FEMALE,
      isActive: true,
      createdAt: items[0].createdAt,
    });
  });
});
