import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { AnimalCategory } from "../animal-category.aggregate";
import { Gender } from "../animal.aggregate";

describe("Category Without Validator Unit Tests", () => {
  beforeEach(() => {
    AnimalCategory.prototype.validate = jest
      .fn()
      .mockImplementation(AnimalCategory.prototype.validate);
  });
  test("constructor of category", () => {
    let animalCategory = new AnimalCategory({
      name: "Movie",
      gender: "F" as any,
    });
    expect(animalCategory.animalCategoryId).toBeInstanceOf(Uuid);
    expect(animalCategory.name).toBe("Movie");
    expect(animalCategory.gender).toBe("F");
    expect(animalCategory.isActive).toBe(true);
    expect(animalCategory.createdAt).toBeInstanceOf(Date);

    let createdAt = new Date();
    animalCategory = new AnimalCategory({
      name: "Movie",
      gender: "F" as any,
      isActive: false,
      createdAt,
    });
    expect(animalCategory.animalCategoryId).toBeInstanceOf(Uuid);
    expect(animalCategory.name).toBe("Movie");
    expect(animalCategory.gender).toBe("F");
    expect(animalCategory.isActive).toBe(false);
    expect(animalCategory.createdAt).toBe(createdAt);

    animalCategory = new AnimalCategory({
      name: "Movie",
      gender: "F" as any,
    });
    expect(animalCategory.animalCategoryId).toBeInstanceOf(Uuid);
    expect(animalCategory.name).toBe("Movie");
    expect(animalCategory.gender).toBe("F");
    expect(animalCategory.isActive).toBe(true);
    expect(animalCategory.createdAt).toBeInstanceOf(Date);

    animalCategory = new AnimalCategory({
      name: "Movie",
      gender: "F" as any,
      isActive: true,
    });
    expect(animalCategory.animalCategoryId).toBeInstanceOf(Uuid);
    expect(animalCategory.name).toBe("Movie");
    expect(animalCategory.gender).toBe("F");
    expect(animalCategory.isActive).toBe(true);
    expect(animalCategory.createdAt).toBeInstanceOf(Date);

    createdAt = new Date();
    animalCategory = new AnimalCategory({
      name: "Movie",
      gender: "F" as any,
      createdAt,
    });
    expect(animalCategory.animalCategoryId).toBeInstanceOf(Uuid);
    expect(animalCategory.name).toBe("Movie");
    expect(animalCategory.gender).toBe("F");
    expect(animalCategory.isActive).toBe(true);
    expect(animalCategory.createdAt).toBe(createdAt);
  });

  describe("create command", () => {
    test("should create a category", () => {
      const animalCategory = AnimalCategory.create({
        name: "Movie",
        gender: "F" as any,
      });
      expect(animalCategory.animalCategoryId).toBeInstanceOf(Uuid);
      expect(animalCategory.name).toBe("Movie");
      expect(animalCategory.gender).toBe("F");
      expect(animalCategory.isActive).toBe(true);
      expect(animalCategory.createdAt).toBeInstanceOf(Date);
      expect(AnimalCategory.prototype.validate).toHaveBeenCalledTimes(1);
      expect(animalCategory.notification.hasErrors()).toBe(false);
    });

    test("should create a category with gender", () => {
      const animalCategory = AnimalCategory.create({
        name: "Movie",
        gender: "F" as any,
      });
      expect(animalCategory.animalCategoryId).toBeInstanceOf(Uuid);
      expect(animalCategory.name).toBe("Movie");
      expect(animalCategory.gender).toBe("F");
      expect(animalCategory.isActive).toBe(true);
      expect(animalCategory.createdAt).toBeInstanceOf(Date);
      expect(AnimalCategory.prototype.validate).toHaveBeenCalledTimes(1);
      expect(animalCategory.notification.hasErrors()).toBe(false);
    });

    test("should create a category with isActive", () => {
      const animalCategory = AnimalCategory.create({
        name: "Movie",
        gender: "F" as any,
        isActive: false,
      });
      expect(animalCategory.animalCategoryId).toBeInstanceOf(Uuid);
      expect(animalCategory.name).toBe("Movie");
      expect(animalCategory.gender).toBe("F");
      expect(animalCategory.isActive).toBe(false);
      expect(animalCategory.createdAt).toBeInstanceOf(Date);
      expect(AnimalCategory.prototype.validate).toHaveBeenCalledTimes(1);
      expect(animalCategory.notification.hasErrors()).toBe(false);
    });
  });

  describe("animalCategoryId field", () => {
    const arrange = [{ id: null }, { id: undefined }, { id: new Uuid() }];

    test.each(arrange)("should be is %j", (props) => {
      const animalCategory = new AnimalCategory(props as any);
      expect(animalCategory.animalCategoryId).toBeInstanceOf(Uuid);
    });
  });

  test("should change name", () => {
    const animalCateogry = new AnimalCategory({
      name: "Movie",
      gender: "F" as any,
    });
    animalCateogry.changeName("other name");
    expect(animalCateogry.name).toBe("other name");
    expect(AnimalCategory.prototype.validate).toHaveBeenCalledTimes(1);
    expect(animalCateogry.notification.hasErrors()).toBe(false);
  });

  test("should change gender", () => {
    const animalCategory = new AnimalCategory({
      name: "Movie",
      gender: "F" as any,
    });
    animalCategory.changeGender("M");
    expect(animalCategory.gender).toBe("M");
    expect(animalCategory.notification.hasErrors()).toBe(false);
  });

  test("should activate a category", () => {
    const animalCategory = new AnimalCategory({
      name: "Filmes",
      gender: "F" as any,
      isActive: false,
    });
    animalCategory.activate();
    expect(animalCategory.isActive).toBe(true);
    expect(animalCategory.notification.hasErrors()).toBe(false);
  });

  test("should deactivate a category", () => {
    const animalCategory = new AnimalCategory({
      name: "Filmes",
      gender: "F" as any,
      isActive: true,
    });
    animalCategory.deactivate();
    expect(animalCategory.isActive).toBe(false);
    expect(animalCategory.notification.hasErrors()).toBe(false);
  });
});

describe("Category Validator", () => {
  describe("create command", () => {
    it("should invalidate ainmal category with name property", () => {
      const animalCategory = AnimalCategory.create({
        name: "t".repeat(256),
        gender: "F" as any,
      });

      expect(animalCategory.notification.hasErrors()).toBe(true);
      expect(animalCategory.notification).notificationContainsErrorMessages([
        {
          name: ["name must be shorter than or equal to 255 characters"],
        },
      ]);
    });

    it("should invalidate ainmal category with gender property", () => {
      const animalCategory = AnimalCategory.create({
        name: "Movie",
        gender: "X" as any,
      });

      expect(animalCategory.notification.hasErrors()).toBe(true);
      expect(animalCategory.notification).notificationContainsErrorMessages([]);
    });
  });

  describe("changeName method", () => {
    it("should a invalid category using name property", () => {
      const animalCategory = AnimalCategory.create({
        name: "Movie",
        gender: "F" as any,
      });
      animalCategory.changeName("t".repeat(256));
      expect(animalCategory.notification.hasErrors()).toBe(true);
      expect(animalCategory.notification).notificationContainsErrorMessages([
        {
          name: ["name must be shorter than or equal to 255 characters"],
        },
      ]);
    });
  });
});
