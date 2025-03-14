import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import {
  InvalidUuidError,
  Uuid,
} from "../../../../../shared/domain/value-objects/uuid.vo";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";
import { AnimalCategory } from "../../../../domain/animal-category.aggregate";
import { Gender } from "../../../../domain/animal.aggregate";
import { AnimalCategoryInMemoryRepository } from "../../../../infra/db/in-memory/animal-category-in-memory.repository";
import { AnimalCategoryModel } from "../../../../infra/db/sequelize/animal-category.model";
import { DeleteAnimalCategoryUseCase } from "../../delete-animal-category.use-case";

describe("Delete Animal Category Use Case Unit Test", () => {
  let useCase: DeleteAnimalCategoryUseCase;
  let repository: AnimalCategoryInMemoryRepository;

  beforeEach(() => {
    repository = new AnimalCategoryInMemoryRepository();
    useCase = new DeleteAnimalCategoryUseCase(repository);
  });

  it("should throw an error on delete when animal category is not found", async () => {
    await expect(() =>
      useCase.execute({ animalCategoryId: "fake id" })
    ).rejects.toThrow(new InvalidUuidError());

    const uuid = new Uuid();

    await expect(() =>
      useCase.execute({ animalCategoryId: uuid.id })
    ).rejects.toThrow(new NotFoundError(uuid.id, AnimalCategory));
  });

  it("should delte an animal category", async () => {
    const items = [
      new AnimalCategory({ name: "test 1", gender: Gender.FEMALE }),
    ];
    repository.items = items;
    await useCase.execute({
      animalCategoryId: items[0].animalCategoryId.id,
    });
    expect(repository.items).toHaveLength(0);
  });
});
