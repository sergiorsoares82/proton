import { Gender } from "../../../domain/animal.aggregate";
import { AnimalCategoryInMemoryRepository } from "../../../infra/db/in-memory/animal-category-in-memory.repository";
import { CreateAnimalCategoryUseCase } from "../../create-animal-category.use-case";

describe("Create Animal Category Use Case Unit Test", () => {
  let useCase: CreateAnimalCategoryUseCase;
  let repository: AnimalCategoryInMemoryRepository;

  beforeEach(() => {
    repository = new AnimalCategoryInMemoryRepository();
    useCase = new CreateAnimalCategoryUseCase(repository);
  });

  it("should create an animal category", async () => {
    const spyInsert = jest.spyOn(repository, "insert");
    let output = await useCase.execute({
      name: "test",
      gender: Gender.FEMALE,
      isActive: true,
    });
    expect(spyInsert).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      animalCategoryId: repository.items[0].animalCategoryId.id,
      name: "test",
      gender: Gender.FEMALE,
      isActive: true,
      createdAt: repository.items[0].createdAt,
    });

    output = await useCase.execute({
      name: "test",
      gender: Gender.MALE,
      isActive: false,
    });
    expect(spyInsert).toHaveBeenCalledTimes(2);
    expect(output).toStrictEqual({
      animalCategoryId: repository.items[1].animalCategoryId.id,
      name: "test",
      gender: Gender.MALE,
      isActive: false,
      createdAt: repository.items[1].createdAt,
    });
  });
});
