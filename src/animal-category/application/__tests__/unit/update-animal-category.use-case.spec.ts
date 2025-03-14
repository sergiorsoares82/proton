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
import { UpdateAnimalCategoryUseCase } from "../../update-animal-category.use-case";

describe("Update Animal Category Use Case Unit Test", () => {
  let useCase: UpdateAnimalCategoryUseCase;
  let repository: AnimalCategoryInMemoryRepository;

  beforeEach(() => {
    repository = new AnimalCategoryInMemoryRepository();
    useCase = new UpdateAnimalCategoryUseCase(repository);
  });

  it("should throw an error on update when animal category is not found", async () => {
    await expect(() =>
      useCase.execute({ animalCategoryId: "fake id", name: "fake" })
    ).rejects.toThrow(new InvalidUuidError());

    const uuid = new Uuid();

    await expect(() =>
      useCase.execute({ animalCategoryId: uuid.id, name: "fake" })
    ).rejects.toThrow(new NotFoundError(uuid.id, AnimalCategory));
  });

  it("should update an animal category", async () => {
    const spyUpdate = jest.spyOn(repository, "update");
    const entity = new AnimalCategory({ name: "calf", gender: Gender.FEMALE });
    repository.items = [entity];

    let output = await useCase.execute({
      animalCategoryId: entity.animalCategoryId.id,
      name: "test",
    });

    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      animalCategoryId: entity.animalCategoryId.id,
      name: "test",
      gender: entity.gender,
      isActive: true,
      createdAt: entity.createdAt,
    });

    type Arrange = {
      input: {
        animalCategoryId: string;
        name: string;
        gender?: null | Gender;
        isActive?: boolean;
      };
      expected: {
        animalCategoryId: string;
        name: string;
        gender: null | Gender;
        isActive: boolean;
        createdAt: Date;
      };
    };
    const arrange: Arrange[] = [
      {
        input: {
          animalCategoryId: entity.animalCategoryId.id,
          name: "test",
          gender: Gender.FEMALE,
        },
        expected: {
          animalCategoryId: entity.animalCategoryId.id,
          name: "test",
          gender: Gender.FEMALE,
          isActive: true,
          createdAt: entity.createdAt,
        },
      },
      {
        input: {
          animalCategoryId: entity.animalCategoryId.id,
          name: "test",
        },
        expected: {
          animalCategoryId: entity.animalCategoryId.id,
          name: "test",
          gender: Gender.FEMALE,
          isActive: true,
          createdAt: entity.createdAt,
        },
      },
      {
        input: {
          animalCategoryId: entity.animalCategoryId.id,
          name: "test",
          isActive: false,
        },
        expected: {
          animalCategoryId: entity.animalCategoryId.id,
          name: "test",
          gender: Gender.FEMALE,
          isActive: false,
          createdAt: entity.createdAt,
        },
      },
      {
        input: {
          animalCategoryId: entity.animalCategoryId.id,
          name: "test",
        },
        expected: {
          animalCategoryId: entity.animalCategoryId.id,
          name: "test",
          gender: Gender.FEMALE,
          isActive: false,
          createdAt: entity.createdAt,
        },
      },
      {
        input: {
          animalCategoryId: entity.animalCategoryId.id,
          name: "test",
          isActive: true,
        },
        expected: {
          animalCategoryId: entity.animalCategoryId.id,
          name: "test",
          gender: Gender.FEMALE,
          isActive: true,
          createdAt: entity.createdAt,
        },
      },
      {
        input: {
          animalCategoryId: entity.animalCategoryId.id,
          name: "test",
          gender: null,
          isActive: false,
        },
        expected: {
          animalCategoryId: entity.animalCategoryId.id,
          name: "test",
          gender: Gender.FEMALE,
          isActive: false,
          createdAt: entity.createdAt,
        },
      },
    ];

    for (const i of arrange) {
      output = await useCase.execute({
        animalCategoryId: i.input.animalCategoryId,
        ...(i.input.name && { name: i.input.name }),
        ...("gender" in i.input && {
          gender: i.input.gender === "M" ? Gender.MALE : Gender.FEMALE,
        }),
        ...("isActive" in i.input && { isActive: i.input.isActive }),
      });
      const entityUpdated = await repository.findById(
        new Uuid(i.input.animalCategoryId)
      );
      expect(output).toStrictEqual({
        animalCategoryId: entity.animalCategoryId.id,
        name: i.expected.name,
        gender: i.expected.gender,
        isActive: i.expected.isActive,
        createdAt: entityUpdated.createdAt,
      });
      expect(entityUpdated.toJSON()).toStrictEqual({
        animalCategoryId: entity.animalCategoryId.id,
        name: i.expected.name,
        gender: i.expected.gender,
        isActive: i.expected.isActive,
        createdAt: entityUpdated.createdAt,
      });
    }
  });
});
