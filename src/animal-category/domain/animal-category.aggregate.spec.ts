import { EntityValidationError } from "../../shared/domain/validators/validation.error";
import { Uuid } from "../../shared/domain/value-objects/uuid.vo";
import { AnimalCategory } from "./animal-category.aggregate";
import { Gender } from "./animal.aggregate";

describe("AnimalCategoryAggregate Unit Tests", () => {
  let validateSpy: any;
  beforeEach(() => {
    validateSpy = jest.spyOn(AnimalCategory, "validate");
  });
  describe("constructor", () => {
    it("should create an instance of AnimalCategory with default values", () => {
      const animalCategory = new AnimalCategory({
        name: "calf",
        gender: Gender.MALE,
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
        gender: Gender.MALE,
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
        gender: Gender.MALE,
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
        gender: Gender.MALE,
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
        gender: Gender.FEMALE,
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
        gender: "F",
        isActive: true,
      });
    });
  });

  describe("Category Validator", () => {
    describe("name property", () => {
      it("should invalidate null name", () => {
        expect(() =>
          AnimalCategory.create({ name: null, gender: Gender.MALE })
        ).containsErrorMessages({
          name: [
            "name should not be empty",
            "name must be a string",
            "name must be shorter than or equal to 255 characters",
          ],
        });
      });

      it("should invalidate empty name", () => {
        expect(() =>
          AnimalCategory.create({ name: "", gender: Gender.FEMALE })
        ).containsErrorMessages({
          name: ["name should not be empty"],
        });
      });

      it("should invalidate non-string name", () => {
        expect(() =>
          AnimalCategory.create({ name: 5 as any, gender: Gender.MALE })
        ).containsErrorMessages({
          name: [
            "name must be a string",
            "name must be shorter than or equal to 255 characters",
          ],
        });
      });

      it("should invalidate long name", () => {
        expect(() =>
          AnimalCategory.create({
            name: "a".repeat(256),
            gender: Gender.FEMALE,
          })
        ).containsErrorMessages({
          name: ["name must be shorter than or equal to 255 characters"],
        });
      });
    });

    describe("gender property", () => {
      it("should invalidate null", () => {
        expect(() =>
          AnimalCategory.create({ name: "calf", gender: null })
        ).containsErrorMessages({
          gender: [
            "gender should not be empty",
            "Gender must be either 'M' or 'F'",
          ],
        });
      });
    });
  });
});
