import { AnimalCategory } from "./animalCategory.aggregate";

describe("AnimalCategoryAggregate", () => {
  describe("constructor", () => {
    it("should create an instance of AnimalCategory with default values", () => {
      const animalCategory = new AnimalCategory({
        name: "calf",
        gender: "M",
      });
      expect(animalCategory).toBeInstanceOf(AnimalCategory);
      expect(animalCategory.animalCategoryId).toBe("");
      expect(animalCategory.name).toBe("calf");
      expect(animalCategory.gender).toBe("M");
      expect(animalCategory.isActive).toBe(true);
    });

    it("should create an instance of AnimalCategory with provided values", () => {
      const animalCategory = new AnimalCategory({
        animalCategoryId: "1",
        name: "calf",
        gender: "M",
        isActive: false,
      });
      expect(animalCategory).toBeInstanceOf(AnimalCategory);
      expect(animalCategory.animalCategoryId).toBe("1");
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
      expect(animalCategory.animalCategoryId).toBe("");
      expect(animalCategory.name).toBe("calf");
      expect(animalCategory.gender).toBe("M");
      expect(animalCategory.isActive).toBe(true);
    });
    it("should create an instance of AnimalCategory with provided values", () => {
      const animalCategory = AnimalCategory.create({
        name: "calf",
        gender: "M",
      });
      expect(animalCategory).toBeInstanceOf(AnimalCategory);
      expect(animalCategory.animalCategoryId).toBe("");
      expect(animalCategory.name).toBe("calf");
      expect(animalCategory.gender).toBe("M");
      expect(animalCategory.isActive).toBe(true);
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
        animalCategoryId: "",
        name: "calf",
        gender: "M",
        isActive: true,
      });
    });
  });
});
