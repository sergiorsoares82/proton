import { AnimalCategory } from "../../domain/animal-category.aggregate";
import { Gender } from "../../domain/animal.aggregate";
import { AnimalCategoryInMemoryRepository } from "./animal-category-in-memory.repository";

describe("AnimalCategoryInMemoryRepository", () => {
  let repository: AnimalCategoryInMemoryRepository;

  beforeEach(() => (repository = new AnimalCategoryInMemoryRepository()));
  it("should no filter items when filter object is null", async () => {
    const items = [
      AnimalCategory.create({ name: "test", gender: Gender.MALE }),
    ];
    const filterSpy = jest.spyOn(items, "filter" as any);

    const itemsFiltered = await repository["applyFilter"](items, null);
    expect(filterSpy).not.toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual(items);
  });

  it("should filter items using filter parameter", async () => {
    const items = [
      new AnimalCategory({ name: "test", gender: Gender.FEMALE }),
      new AnimalCategory({ name: "TEST", gender: Gender.FEMALE }),
      new AnimalCategory({ name: "fake", gender: Gender.FEMALE }),
    ];
    const filterSpy = jest.spyOn(items, "filter" as any);

    const itemsFiltered = await repository["applyFilter"](items, "TEST");
    expect(filterSpy).toHaveBeenCalledTimes(1);
    expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
  });

  it("should sort by name", async () => {
    const items = [
      AnimalCategory.create({ name: "c", gender: Gender.FEMALE }),
      AnimalCategory.create({ name: "b", gender: Gender.FEMALE }),
      AnimalCategory.create({ name: "a", gender: Gender.FEMALE }),
    ];

    let itemsSorted = await repository["applySort"](items, "name", "asc");
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);

    itemsSorted = await repository["applySort"](items, "name", "desc");
    expect(itemsSorted).toStrictEqual([items[0], items[1], items[2]]);
  });
});
