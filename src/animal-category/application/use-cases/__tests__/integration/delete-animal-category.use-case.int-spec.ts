import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";
import { AnimalCategory } from "../../../../domain/animal-category.aggregate";
import { Gender } from "../../../../domain/animal.aggregate";
import { AnimalCategorySequelizeRepository } from "../../../../infra/db/sequelize/animal-category-sequelize.repository";
import { AnimalCategoryModel } from "../../../../infra/db/sequelize/animal-category.model";
import { DeleteAnimalCategoryUseCase } from "../../delete-animal-category.use-case";
import { UpdateAnimalCategoryUseCase } from "../../update-animal-category.use-case";

describe("Delete Animal Category Use Case Integration Tests", () => {
  let useCase: DeleteAnimalCategoryUseCase;
  let repository: AnimalCategorySequelizeRepository;

  setupSequelize({ models: [AnimalCategoryModel] });

  beforeEach(() => {
    repository = new AnimalCategorySequelizeRepository(AnimalCategoryModel);
    useCase = new DeleteAnimalCategoryUseCase(repository);
  });

  it("should throw an error on update when animal category is not found", async () => {
    const uuid = new Uuid();

    await expect(
      useCase.execute({ animalCategoryId: uuid.id })
    ).rejects.toThrow(new NotFoundError(uuid.id, AnimalCategory));
  });

  it("should delete an animal category", async () => {
    const category = AnimalCategory.fake().aAnimalCategory().build();
    await repository.insert(category);
    await useCase.execute({
      animalCategoryId: category.animalCategoryId.id,
    });

    await expect(
      repository.findById(category.animalCategoryId)
    ).resolves.toBeNull();
  });
});
