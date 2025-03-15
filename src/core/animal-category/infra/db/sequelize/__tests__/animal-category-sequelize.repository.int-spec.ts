import { Sequelize } from "sequelize-typescript";
import { AnimalCategorySequelizeRepository } from "../animal-category-sequelize.repository";
import { AnimalCategoryModel } from "../animal-category.model";
import { AnimalCategory } from "../../../../domain/animal-category.aggregate";
import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";
import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import { AnimalCategoryModelMapper } from "../animal-category-model.mapper";
import {
  AnimalCategorySearchParams,
  AnimalCategorySearchResult,
} from "../../../../domain/animal-category.repository";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";

describe("AnimalCategorySequelizeRepository Integration Tests", () => {
  let sequelize: Sequelize;
  let repository: AnimalCategorySequelizeRepository;

  setupSequelize({ models: [AnimalCategoryModel] });

  beforeEach(async () => {
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

  describe("search", () => {
    it("should return all entities using pagination only when search params is null", async () => {
      const createdAt = new Date();
      const animalCateogries = AnimalCategory.fake()
        .theCategories(16)
        .withName("Category")
        .withCreatedAt(createdAt)
        .build();
      await repository.bulkInsert(animalCateogries);

      const spyToEntity = jest.spyOn(AnimalCategoryModelMapper, "toEntity");

      const params = new AnimalCategorySearchParams();
      const searchOutput = await repository.search(params);
      expect(searchOutput).toBeInstanceOf(AnimalCategorySearchResult);
      expect(spyToEntity).toHaveBeenCalledTimes(15);
      expect(searchOutput.toJSON()).toMatchObject({
        total: 16,
        current_page: 1,
        last_page: 2,
        per_page: 15,
      });
      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(AnimalCategory);
        expect(item.animalCategoryId).toBeDefined();
      });
      const items = searchOutput.items.map((item) => item.toJSON());
      expect(items).toMatchObject(
        new Array(15).fill({
          name: "Category",
          isActive: true,
          createdAt: createdAt,
        })
      );
    });

    it("should order by createdAt DESC when search params are null", async () => {
      const createdAt = new Date();
      const categories = AnimalCategory.fake()
        .theCategories(16)
        .withName((index) => `Category ${index}`)
        .withCreatedAt((index) => new Date(createdAt.getTime() + index))
        .build();
      const searchOutput = await repository.search(
        new AnimalCategorySearchParams()
      );
      const items = searchOutput.items;
      [...items].reverse().forEach((item, index) => {
        expect(`Category ${index}`).toBe(`${categories[index + 1].name}`);
      });
    });

    it("should apply paginate and filter", async () => {
      const animalCategories = [
        AnimalCategory.fake()
          .aAnimalCategory()
          .withName("test")
          .withCreatedAt(new Date(new Date().getTime() + 5000))
          .build(),
        AnimalCategory.fake()
          .aAnimalCategory()
          .withName("a")
          .withCreatedAt(new Date(new Date().getTime() + 4000))
          .build(),
        AnimalCategory.fake()
          .aAnimalCategory()
          .withName("TEST")
          .withCreatedAt(new Date(new Date().getTime() + 3000))
          .build(),
        AnimalCategory.fake()
          .aAnimalCategory()
          .withName("TeSt")
          .withCreatedAt(new Date(new Date().getTime() + 1000))
          .build(),
      ];

      await repository.bulkInsert(animalCategories);

      let searchOutput = await repository.search(
        new AnimalCategorySearchParams({
          page: 1,
          per_page: 2,
          filter: "TEST",
        })
      );

      expect(searchOutput.toJSON(true)).toMatchObject(
        new AnimalCategorySearchResult({
          items: [animalCategories[0], animalCategories[2]],
          total: 3,
          current_page: 1,
          per_page: 2,
        }).toJSON(true)
      );

      searchOutput = await repository.search(
        new AnimalCategorySearchParams({
          page: 2,
          per_page: 2,
          filter: "TEST",
        })
      );
      expect(searchOutput.toJSON(true)).toMatchObject(
        new AnimalCategorySearchResult({
          items: [animalCategories[3]],
          total: 3,
          current_page: 2,
          per_page: 2,
        }).toJSON(true)
      );
    });

    it("should apply paginate and sort", async () => {
      expect(repository.sortableFields).toStrictEqual(["name", "createdAt"]);

      const animalCategories = [
        AnimalCategory.fake().aAnimalCategory().withName("b").build(),
        AnimalCategory.fake().aAnimalCategory().withName("a").build(),
        AnimalCategory.fake().aAnimalCategory().withName("d").build(),
        AnimalCategory.fake().aAnimalCategory().withName("e").build(),
        AnimalCategory.fake().aAnimalCategory().withName("c").build(),
      ];
      await repository.bulkInsert(animalCategories);

      const arrange = [
        {
          params: new AnimalCategorySearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
          }),
          result: new AnimalCategorySearchResult({
            items: [animalCategories[1], animalCategories[0]],
            total: 5,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          params: new AnimalCategorySearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
          }),
          result: new AnimalCategorySearchResult({
            items: [animalCategories[4], animalCategories[2]],
            total: 5,
            current_page: 2,
            per_page: 2,
          }),
        },
        {
          params: new AnimalCategorySearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
          }),
          result: new AnimalCategorySearchResult({
            items: [animalCategories[3], animalCategories[2]],
            total: 5,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          params: new AnimalCategorySearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
          }),
          result: new AnimalCategorySearchResult({
            items: [animalCategories[4], animalCategories[0]],
            total: 5,
            current_page: 2,
            per_page: 2,
          }),
        },
      ];

      for (const i of arrange) {
        const result = await repository.search(i.params);
        expect(result.toJSON(true)).toMatchObject(i.result.toJSON(true));
      }
    });

    describe("should search using filter, sort and paginate", () => {
      const animalCategories = [
        AnimalCategory.fake().aAnimalCategory().withName("test").build(),
        AnimalCategory.fake().aAnimalCategory().withName("a").build(),
        AnimalCategory.fake().aAnimalCategory().withName("TEST").build(),
        AnimalCategory.fake().aAnimalCategory().withName("e").build(),
        AnimalCategory.fake().aAnimalCategory().withName("TeSt").build(),
      ];

      const arrange = [
        {
          search_params: new AnimalCategorySearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
            filter: "TEST",
          }),
          search_result: new AnimalCategorySearchResult({
            items: [animalCategories[2], animalCategories[4]],
            total: 3,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          search_params: new AnimalCategorySearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
            filter: "TEST",
          }),
          search_result: new AnimalCategorySearchResult({
            items: [animalCategories[0]],
            total: 3,
            current_page: 2,
            per_page: 2,
          }),
        },
      ];

      beforeEach(async () => {
        await repository.bulkInsert(animalCategories);
      });

      test.each(arrange)(
        "when value is $search_params",
        async ({ search_params, search_result }) => {
          const result = await repository.search(search_params);
          expect(result.toJSON(true)).toMatchObject(search_result.toJSON(true));
        }
      );
    });
  });
});
