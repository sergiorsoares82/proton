import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";
import { Gender } from "../../../../domain/animal.aggregate";
import { AnimalCategoryInMemoryRepository } from "../../../../infra/db/in-memory/animal-category-in-memory.repository";
import { AnimalCategorySequelizeRepository } from "../../../../infra/db/sequelize/animal-category-sequelize.repository";
import { AnimalCategoryModel } from "../../../../infra/db/sequelize/animal-category.model";
import { CreateAnimalCategoryUseCase } from "../../create-animal-category.use-case";

describe("Create Animal Category Use Case Integration Tests", () => {
  let useCase: CreateAnimalCategoryUseCase;
  let repository: AnimalCategorySequelizeRepository;

  setupSequelize({ models: [AnimalCategoryModel] });

  beforeEach(() => {
    repository = new AnimalCategorySequelizeRepository(AnimalCategoryModel);
    useCase = new CreateAnimalCategoryUseCase(repository);
  });

  it("should create an animal category", async () => {
    let output = await useCase.execute({ name: "test", gender: Gender.FEMALE });
    let entity = await repository.findById(new Uuid(output.animalCategoryId));
    expect(output).toStrictEqual({
      animalCategoryId: entity.animalCategoryId.id,
      name: "test",
      gender: Gender.FEMALE,
      isActive: true,
      createdAt: entity.createdAt,
    });

    output = await useCase.execute({
      name: "test",
      gender: Gender.MALE,
    });
    entity = await repository.findById(new Uuid(output.animalCategoryId));
    expect(output).toStrictEqual({
      animalCategoryId: entity.animalCategoryId.id,
      name: "test",
      gender: Gender.MALE,
      isActive: true,
      createdAt: entity.createdAt,
    });

    output = await useCase.execute({
      name: "test",
      gender: Gender.FEMALE,
      isActive: true,
    });
    entity = await repository.findById(new Uuid(output.animalCategoryId));
    expect(output).toStrictEqual({
      animalCategoryId: entity.animalCategoryId.id,
      name: "test",
      gender: Gender.FEMALE,
      isActive: true,
      createdAt: entity.createdAt,
    });

    output = await useCase.execute({
      name: "test",
      gender: Gender.FEMALE,
      isActive: false,
    });
    entity = await repository.findById(new Uuid(output.animalCategoryId));
    expect(output).toStrictEqual({
      animalCategoryId: entity.animalCategoryId.id,
      name: "test",
      gender: Gender.FEMALE,
      isActive: false,
      createdAt: entity.createdAt,
    });
  });
});
