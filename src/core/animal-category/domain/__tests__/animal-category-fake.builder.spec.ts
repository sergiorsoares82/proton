import { Chance } from "chance";
import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { AnimalCategoryFakeBuilder } from "../animal-category-fake.builder";
import { Gender } from "../animal.aggregate";

describe("AnimalCategoryFakerBuilder Unit Tests", () => {
  describe("animalCategoryId prop", () => {
    const faker = AnimalCategoryFakeBuilder.aAnimalCategory();

    test("should throw error when any with methods has called", () => {
      expect(() => faker.animalCategoryId).toThrow(
        new Error(
          "Property animalCategoryId does not have a factory, use 'with' methods"
        )
      );
    });

    test("should be undefined", () => {
      expect(faker["_animalCategoryId"]).toBeUndefined();
    });

    test("withUuid", () => {
      const animalCategoryId = new Uuid();
      const $this = faker.withUuid(animalCategoryId);
      expect($this).toBeInstanceOf(AnimalCategoryFakeBuilder);
      expect(faker["_animalCategoryId"]).toBe(animalCategoryId);

      faker.withUuid(() => animalCategoryId);
      //@ts-expect-error _animalCategoryId is a callable
      expect(faker["_animalCategoryId"]()).toBe(animalCategoryId);

      expect(faker.animalCategoryId).toBe(animalCategoryId);
    });

    //TODO - melhorar este nome
    test("should pass index to animalCategoryId factory", () => {
      let mockFactory = jest.fn(() => new Uuid());
      faker.withUuid(mockFactory);
      faker.build();
      expect(mockFactory).toHaveBeenCalledTimes(1);

      const categoryId = new Uuid();
      mockFactory = jest.fn(() => categoryId);
      const fakerMany = AnimalCategoryFakeBuilder.theCategories(2);
      fakerMany.withUuid(mockFactory);
      fakerMany.build();

      expect(mockFactory).toHaveBeenCalledTimes(2);
      expect(fakerMany.build()[0].animalCategoryId).toBe(categoryId);
      expect(fakerMany.build()[1].animalCategoryId).toBe(categoryId);
    });
  });

  describe("name prop", () => {
    const faker = AnimalCategoryFakeBuilder.aAnimalCategory();
    test("should be a function", () => {
      expect(typeof faker["_name"]).toBe("function");
    });

    test("should call the word method", () => {
      const chance = Chance();
      const spyWordMethod = jest.spyOn(chance, "word");
      faker["chance"] = chance;
      faker.build();

      expect(spyWordMethod).toHaveBeenCalled();
    });

    test("withName", () => {
      const $this = faker.withName("test name");
      expect($this).toBeInstanceOf(AnimalCategoryFakeBuilder);
      expect(faker["_name"]).toBe("test name");

      faker.withName(() => "test name");
      //@ts-expect-error name is callable
      expect(faker["_name"]()).toBe("test name");

      expect(faker.name).toBe("test name");
    });

    test("should pass index to name factory", () => {
      faker.withName((index) => `test name ${index}`);
      const category = faker.build();
      expect(category.name).toBe(`test name 0`);

      const fakerMany = AnimalCategoryFakeBuilder.theCategories(2);
      fakerMany.withName((index) => `test name ${index}`);
      const categories = fakerMany.build();

      expect(categories[0].name).toBe(`test name 0`);
      expect(categories[1].name).toBe(`test name 1`);
    });

    test("invalid too long case", () => {
      const $this = faker.withInvalidNameTooLong();
      expect($this).toBeInstanceOf(AnimalCategoryFakeBuilder);
      expect(faker["_name"].length).toBe(256);

      const tooLong = "a".repeat(256);
      faker.withInvalidNameTooLong(tooLong);
      expect(faker["_name"].length).toBe(256);
      expect(faker["_name"]).toBe(tooLong);
    });
  });

  describe("gender prop", () => {
    const faker = AnimalCategoryFakeBuilder.aAnimalCategory();
    test("should be a function", () => {
      expect(typeof faker["_gender"]).toBe("function");
    });

    test("should call the pick one method", () => {
      const chance = Chance();
      const spyParagraphMethod = jest.spyOn(chance, "pickone");
      faker["chance"] = chance;
      faker.build();
      expect(spyParagraphMethod).toHaveBeenCalled();
    });

    test("withGender", () => {
      const $this = faker.withGender(Gender.MALE);
      expect($this).toBeInstanceOf(AnimalCategoryFakeBuilder);
      expect(faker["_gender"]).toBe("M");

      faker.withGender(() => Gender.MALE);
      //@ts-expect-error description is callable
      expect(faker["_gender"]()).toBe("M");

      expect(faker.gender).toBe("M");
    });
  });

  describe("isActive prop", () => {
    const faker = AnimalCategoryFakeBuilder.aAnimalCategory();
    test("should be a function", () => {
      expect(typeof faker["_isActive"]).toBe("function");
    });

    test("activate", () => {
      const $this = faker.activate();
      expect($this).toBeInstanceOf(AnimalCategoryFakeBuilder);
      expect(faker["_isActive"]).toBe(true);
      expect(faker.isActive).toBe(true);
    });

    test("deactivate", () => {
      const $this = faker.deactivate();
      expect($this).toBeInstanceOf(AnimalCategoryFakeBuilder);
      expect(faker["_isActive"]).toBe(false);
      expect(faker.isActive).toBe(false);
    });
  });

  describe("createdAt prop", () => {
    const faker = AnimalCategoryFakeBuilder.aAnimalCategory();

    test("should throw error when any with methods has called", () => {
      const fakerCategory = AnimalCategoryFakeBuilder.aAnimalCategory();
      expect(() => fakerCategory.createdAt).toThrow(
        new Error(
          "Property createdAt does not have a factory, use 'with' methods"
        )
      );
    });

    test("should be undefined", () => {
      expect(faker["_createdAt"]).toBeUndefined();
    });

    test("withCreatedAt", () => {
      const date = new Date();
      const $this = faker.withCreatedAt(date);
      expect($this).toBeInstanceOf(AnimalCategoryFakeBuilder);
      expect(faker["_createdAt"]).toBe(date);

      faker.withCreatedAt(() => date);
      //@ts-expect-error _createdAt is a callable
      expect(faker["_createdAt"]()).toBe(date);
      expect(faker.createdAt).toBe(date);
    });

    test("should pass index to createdAt factory", () => {
      const date = new Date();
      faker.withCreatedAt((index) => new Date(date.getTime() + index + 2));
      const category = faker.build();
      expect(category.createdAt.getTime()).toBe(date.getTime() + 2);

      const fakerMany = AnimalCategoryFakeBuilder.theCategories(2);
      fakerMany.withCreatedAt((index) => new Date(date.getTime() + index + 2));
      const categories = fakerMany.build();

      expect(categories[0].createdAt.getTime()).toBe(date.getTime() + 2);
      expect(categories[1].createdAt.getTime()).toBe(date.getTime() + 3);
    });
  });

  test("should create a category", () => {
    const faker = AnimalCategoryFakeBuilder.aAnimalCategory();
    let animalCategory = faker.build();

    expect(animalCategory.animalCategoryId).toBeInstanceOf(Uuid);
    expect(typeof animalCategory.name === "string").toBeTruthy();
    expect(typeof animalCategory.gender === "string").toBeTruthy();
    expect(animalCategory.isActive).toBe(true);
    expect(animalCategory.createdAt).toBeInstanceOf(Date);

    const createdAt = new Date();
    const animalCategoryId = new Uuid();
    animalCategory = faker
      .withUuid(animalCategoryId)
      .withName("name test")
      .withGender(Gender.MALE)
      .deactivate()
      .withCreatedAt(createdAt)
      .build();

    expect(animalCategory.animalCategoryId.id).toBe(animalCategoryId.id);
    expect(animalCategory.name).toBe("name test");
    expect(animalCategory.gender).toBe("M");
    expect(animalCategory.isActive).toBe(false);
    expect(animalCategory.createdAt).toStrictEqual(createdAt);
  });

  test("should create many categories", () => {
    const faker = AnimalCategoryFakeBuilder.theCategories(2);
    let animalCategories = faker.build();

    animalCategories.forEach((animalCategory) => {
      expect(animalCategory.animalCategoryId).toBeInstanceOf(Uuid);
      expect(typeof animalCategory.name === "string").toBeTruthy();
      expect(typeof animalCategory.gender === "string").toBeTruthy();
      expect(animalCategory.isActive).toBe(true);
      expect(animalCategory.createdAt).toBeInstanceOf(Date);
    });

    const createdAt = new Date();
    const animalCategoryId = new Uuid();
    animalCategories = faker
      .withUuid(animalCategoryId)
      .withName("name test")
      .withGender(Gender.MALE)
      .deactivate()
      .withCreatedAt(createdAt)
      .build();

    animalCategories.forEach((animalCategory) => {
      expect(animalCategory.animalCategoryId.id).toBe(animalCategoryId.id);
      expect(animalCategory.name).toBe("name test");
      expect(animalCategory.gender).toBe("M");
      expect(animalCategory.isActive).toBe(false);
      expect(animalCategory.createdAt).toStrictEqual(createdAt);
    });
  });
});
