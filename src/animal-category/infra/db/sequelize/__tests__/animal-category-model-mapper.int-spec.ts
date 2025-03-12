import { Sequelize } from "sequelize-typescript";
import { AnimalCategoryModel } from "../animal-category.model";
import { AnimalCategoryModelMapper } from "../animal-category-model.mapper";
import { EntityValidationError } from "../../../../../shared/domain/validators/validation.error";
import { Gender } from "../../../../domain/animal.aggregate";
import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";
import { AnimalCategory } from "../../../../domain/animal-category.aggregate";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";

describe("AnimalCategory Model Mapper integration Tests", () => {
  setupSequelize({ models: [AnimalCategoryModel] });

  it("should throw an error when animal category is invalid", async () => {
    const model = AnimalCategoryModel.build({
      animalCategoryId: "9366b7dc-2d71-4799-b91c-c64adb205104",
    });

    try {
      AnimalCategoryModelMapper.toEntity(model);
      fail(
        "The category is valid, but it needs throws a EntityValidationError"
      );
    } catch (e) {
      expect(e).toBeInstanceOf(EntityValidationError);
      expect((e as EntityValidationError).error).toMatchObject({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });
    }
  });

  it("should map a model to an entity", async () => {
    const createdAt = new Date();
    const model = AnimalCategoryModel.build({
      animalCategoryId: "5490020a-e866-4229-9adc-aa44b83234c4",
      name: "some value",
      gender: Gender.FEMALE,
      isActive: true,
      createdAt,
    });
    const aggregate = AnimalCategoryModelMapper.toEntity(model);

    expect(aggregate.toJSON()).toStrictEqual(
      new AnimalCategory({
        animalCategoryId: new Uuid("5490020a-e866-4229-9adc-aa44b83234c4"),
        name: "some value",
        gender: Gender.FEMALE,
        isActive: true,
        createdAt,
      }).toJSON()
    );
  });

  it("should map an entity to a model", async () => {
    const createdAt = new Date();
    const entity = new AnimalCategory({
      animalCategoryId: new Uuid("5490020a-e866-4229-9adc-aa44b83234c4"),
      name: "some value",
      gender: Gender.FEMALE,
      isActive: true,
      createdAt,
    });

    const model = AnimalCategoryModelMapper.toModel(entity);

    expect(model.toJSON()).toStrictEqual({
      animalCategoryId: "5490020a-e866-4229-9adc-aa44b83234c4",
      name: "some value",
      gender: "F",
      isActive: true,
      createdAt,
    });
  });
});
