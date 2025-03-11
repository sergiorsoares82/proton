import { AnimalCategory } from "../../../domain/animal-category.aggregate";
import { Gender } from "../../../domain/animal.aggregate";
import { AnimalCategoryInMemoryRepository } from "./animal-category-in-memory.repository";

describe("AnimalCategoryInMemoryRepository", () => {
  let repository: AnimalCategoryInMemoryRepository;

  beforeEach(() => (repository = new AnimalCategoryInMemoryRepository()));
  it("should no filter items when filter object is null", async () => {
    const items = [AnimalCategory.fake().aAnimalCategory().build()];
    const filterSpy = jest.spyOn(items, "filter" as any);

    const itemsFiltered = await repository["applyFilter"](items, null);
    expect(filterSpy).not.toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual(items);
  });

  it("should filter items using filter parameter", async () => {
    const items = [
      AnimalCategory.fake().aAnimalCategory().withName("test").build(),
      AnimalCategory.fake().aAnimalCategory().withName("TEST").build(),
      AnimalCategory.fake().aAnimalCategory().withName("fake").build(),
    ];
    const filterSpy = jest.spyOn(items, "filter" as any);

    const itemsFiltered = await repository["applyFilter"](items, "TEST");
    expect(filterSpy).toHaveBeenCalledTimes(1);
    expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
  });

  it("should sort by created_at when sort param is null", async () => {
    const created_at = new Date();

    const items = [
      AnimalCategory.fake()
        .aAnimalCategory()
        .withName("test")
        .withCreatedAt(created_at)
        .build(),
      AnimalCategory.fake()
        .aAnimalCategory()
        .withName("TEST")
        .withCreatedAt(new Date(created_at.getTime() + 100))
        .build(),
      AnimalCategory.fake()
        .aAnimalCategory()
        .withName("fake")
        .withCreatedAt(new Date(created_at.getTime() + 200))
        .build(),
    ];

    const itemsSorted = await repository["applySort"](items, null, null);
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);
  });

  it("should sort by name", async () => {
    const items = [
      AnimalCategory.fake().aAnimalCategory().withName("c").build(),
      AnimalCategory.fake().aAnimalCategory().withName("b").build(),
      AnimalCategory.fake().aAnimalCategory().withName("a").build(),
    ];

    let itemsSorted = await repository["applySort"](items, "name", "asc");
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);

    itemsSorted = await repository["applySort"](items, "name", "desc");
    expect(itemsSorted).toStrictEqual([items[0], items[1], items[2]]);
  });
});
