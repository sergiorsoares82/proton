import { Uuid } from "../../shared/domain/value-object/uuid.vo";
import { AnimalCategory } from "./animal-category.aggregate";

describe("AnimalCategoryAggregate Unit Tests", () => {
  let validateSpy: any;
  beforeEach(() => {
    validateSpy = jest.spyOn(AnimalCategory, "validate");
  });
  describe("constructor", () => {
    it("should create an instance of AnimalCategory with default values", () => {
      const animalCategory = new AnimalCategory({
        name: "calf",
        gender: "M",
      });
      expect(animalCategory).toBeInstanceOf(AnimalCategory);
      expect(animalCategory.animalCategoryId).toBeInstanceOf(Uuid);
      expect(animalCategory.name).toBe("calf");
      expect(animalCategory.gender).toBe("M");
      expect(animalCategory.isActive).toBe(true);
    });

    it("should create an instance of AnimalCategory with provided values", () => {
      const animalCategory = new AnimalCategory({
        animalCategoryId: new Uuid(),
        name: "calf",
        gender: "M",
        isActive: false,
      });
      expect(animalCategory).toBeInstanceOf(AnimalCategory);
      expect(animalCategory.animalCategoryId).toBeInstanceOf(Uuid);
      expect(animalCategory.name).toBe("calf");
      expect(animalCategory.gender).toBe("M");
      expect(animalCategory.isActive).toBe(false);
    });
  });

  describe("create", () => {
    it("should create an instance of AnimalCategory with default values", () => {
      const animalCategory = AnimalCategory.create({
        name: "calf",
        gender: "M",
      });
      expect(animalCategory).toBeInstanceOf(AnimalCategory);
      expect(animalCategory.animalCategoryId).toBeInstanceOf(Uuid);
      expect(animalCategory.name).toBe("calf");
      expect(animalCategory.gender).toBe("M");
      expect(animalCategory.isActive).toBe(true);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });
    it("should create an instance of AnimalCategory with provided values", () => {
      const animalCategory = AnimalCategory.create({
        name: "calf",
        gender: "M",
      });
      expect(animalCategory).toBeInstanceOf(AnimalCategory);
      expect(animalCategory.animalCategoryId).toBeInstanceOf(Uuid);
      expect(animalCategory.name).toBe("calf");
      expect(animalCategory.gender).toBe("M");
      expect(animalCategory.isActive).toBe(true);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("operations", () => {
    let animalCategory: AnimalCategory;
    beforeEach(() => {
      animalCategory = new AnimalCategory({
        name: "calf",
        gender: "M",
      });
    });

    it("should change the name of the animal category", () => {
      animalCategory.changeName("cow");
      expect(animalCategory.name).toBe("cow");
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    it("should activate the animal category", () => {
      animalCategory.deactivate();
      animalCategory.activate();
      expect(animalCategory.isActive).toBe(true);
    });

    it("should deactivate the animal category", () => {
      animalCategory.deactivate();
      expect(animalCategory.isActive).toBe(false);
    });

    it("should convert the animal category to JSON", () => {
      const json = animalCategory.toJSON();
      expect(json).toEqual({
        animalCategoryId: animalCategory.animalCategoryId.id,
        name: "calf",
        gender: "M",
        isActive: true,
      });
    });
  });
});
