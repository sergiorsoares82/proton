import { Sequelize } from "sequelize-typescript";
import { AnimalCategorySequelizeRepository } from "../animal-category-sequelize.repository";
import { AnimalCategoryModel } from "../animal-category.model";
import { AnimalCategory } from "../../../../domain/animal-category.aggregate";
import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";
import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";

describe("AnimalCategorySequelizeRepository Integration Tests", () => {
  let sequelize: Sequelize;
  let repository: AnimalCategorySequelizeRepository;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      models: [AnimalCategoryModel],
      logging: false,
    });
    await sequelize.sync({ force: true });
    repository = new AnimalCategorySequelizeRepository(AnimalCategoryModel);
  });

  it("should insert an entity", async () => {
    const animalCateogry = AnimalCategory.fake().aAnimalCategory().build();
    await repository.insert(animalCateogry);

    const entity = await AnimalCategoryModel.findByPk(
      animalCateogry.animalCategoryId.id
    );
    expect(entity.toJSON()).toStrictEqual(animalCateogry.toJSON());
  });

  it("should bulk insert entities", async () => {
    const animalCateogries = AnimalCategory.fake().theCategories(2).build();
    await repository.bulkInsert(animalCateogries);

    const entities = await AnimalCategoryModel.findAll();
    expect(entities.map((entity) => entity.toJSON())).toStrictEqual(
      animalCateogries.map((animalCateogry) => animalCateogry.toJSON())
    );
  });

  it("should return null when entity is not found", async () => {
    const entity = await repository.findById(new Uuid());
    expect(entity).toBeNull();
  });

  it("should find an entity by id", async () => {
    const animalCateogry = AnimalCategory.fake().aAnimalCategory().build();
    await repository.insert(animalCateogry);

    const entity = await repository.findById(animalCateogry.animalCategoryId);
    expect(entity).toStrictEqual(animalCateogry);
  });

  it("should find all entities", async () => {
    const animalCateogry = AnimalCategory.fake().aAnimalCategory().build();
    await repository.insert(animalCateogry);

    const entities = await repository.findAll();
    expect(entities).toStrictEqual([animalCateogry]);
  });

  it("should throw error on update when entity is not found", async () => {
    const entity = AnimalCategory.fake().aAnimalCategory().build();
    await expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(entity.animalCategoryId.id, AnimalCategory)
    );
  });

  it("should update an entity", async () => {
    const animalCateogry = AnimalCategory.fake().aAnimalCategory().build();
    await repository.insert(animalCateogry);

    const entity = await repository.findById(animalCateogry.animalCategoryId);
    entity.deactivate();
    await repository.update(entity);

    const updatedEntity = await repository.findById(
      animalCateogry.animalCategoryId
    );
    expect(updatedEntity).toStrictEqual(entity);
  });

  it("should throw error on delete when entity is not found", async () => {
    const entityId = new Uuid();
    await expect(repository.delete(entityId)).rejects.toThrow(
      new NotFoundError(entityId.id, AnimalCategory)
    );
  });

  it("should delete an entity", async () => {
    const animalCateogry = AnimalCategory.fake().aAnimalCategory().build();
    await repository.insert(animalCateogry);

    await repository.delete(animalCateogry.animalCategoryId);

    const entity = await repository.findById(animalCateogry.animalCategoryId);
    expect(entity).toBeNull();
  });
});
