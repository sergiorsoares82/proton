import { DataType, Sequelize } from "sequelize-typescript";
import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";
import { Gender } from "../../../../domain/animal.aggregate";
import { AnimalCategoryModel } from "../animal-category.model";
import { Config } from "../../../../../shared/infra/config";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";

describe("AnimalCategoryModel Integration Tests", () => {
  setupSequelize({ models: [AnimalCategoryModel] });

  describe("mapping props", () => {
    let attributesMap: Record<string, any>;
    let attributes: string[];

    beforeEach(() => {
      attributesMap = AnimalCategoryModel.getAttributes();
      attributes = Object.keys(attributesMap);
    });
    it("should have props mapped correctly", async () => {
      expect(attributes).toStrictEqual([
        "animalCategoryId",
        "name",
        "gender",
        "isActive",
        "createdAt",
      ]);
    });

    it("should map animalCategoryId as primary key", async () => {
      const animalCategoryIdAttribute = attributesMap.animalCategoryId;
      expect(animalCategoryIdAttribute).toMatchObject({
        field: "animalCategoryId",
        fieldName: "animalCategoryId",
        primaryKey: true,
        type: DataType.UUID(),
      });
    });

    it("should map name", async () => {
      const nameAttribute = attributesMap.name;
      expect(nameAttribute).toMatchObject({
        field: "name",
        fieldName: "name",
        type: DataType.STRING(255),
        allowNull: false,
      });
    });

    it("should map gender", async () => {
      const genderAttribute = attributesMap.gender;
      expect(genderAttribute).toMatchObject({
        field: "gender",
        fieldName: "gender",
        type: DataType.ENUM("M", "F"),
        allowNull: false,
      });
    });

    it("should map isActive", async () => {
      const isActiveAttribute = attributesMap.isActive;
      expect(isActiveAttribute).toMatchObject({
        field: "isActive",
        fieldName: "isActive",
        type: DataType.BOOLEAN(),
        allowNull: false,
      });
    });

    it("should map createdAt", async () => {
      const createdAtAttribute = attributesMap.createdAt;
      expect(createdAtAttribute).toMatchObject({
        field: "createdAt",
        fieldName: "createdAt",
        type: DataType.DATE(3),
        allowNull: false,
      });
    });
  });

  it("should create a new animal category", async () => {
    const animalCategory = {
      animalCategoryId: new Uuid().id,
      name: "test",
      gender: Gender.FEMALE,
      isActive: true,
      createdAt: new Date(),
    };

    const created = await AnimalCategoryModel.create({
      animalCategoryId: animalCategory.animalCategoryId,
      name: animalCategory.name,
      gender: animalCategory.gender,
      isActive: animalCategory.isActive,
      createdAt: animalCategory.createdAt,
    });

    expect(created.toJSON()).toStrictEqual(animalCategory);
  });
});
