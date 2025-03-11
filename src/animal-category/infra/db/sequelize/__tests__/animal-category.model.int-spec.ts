import { Sequelize } from "sequelize-typescript";
import { AnimalCategoryModel } from "../animal-category.model";
import { AnimalCategory } from "../../../../domain/animal-category.aggregate";

describe("AnimalCategoryModel Integration Tests", () => {
  let sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    models: [AnimalCategoryModel],
  });
  it("should create a new animal category", async () => {
    await sequelize.sync({ force: true });

    const animalCategory = AnimalCategory.fake().aAnimalCategory().build();

    const created = await AnimalCategoryModel.create({
      animalCategoryId: animalCategory.animalCategoryId,
      name: animalCategory.name,
      gender: animalCategory.gender,
      isActive: animalCategory.isActive,
      createdAt: animalCategory.createdAt,
    });
  });
});
