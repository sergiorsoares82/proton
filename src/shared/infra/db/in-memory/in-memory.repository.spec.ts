import { Entity } from "../../../domain/entity";
import { NotFoundError } from "../../../domain/errors/not-found.error";
import { Uuid } from "../../../domain/value-objects/uuid.vo";
import { InMemoryRepository } from "./in-memory.repository";

type StubEntityConstructorProps = {
  entityId: Uuid;
  property1: string;
  property2: number;
  property3: boolean;
};

class StubEntity extends Entity {
  entityId: Uuid;
  property1: string;
  property2: number;
  property3: boolean;

  constructor(props: StubEntityConstructorProps) {
    super();
    this.entityId = props.entityId;
    this.property1 = props.property1;
    this.property2 = props.property2;
    this.property3 = props.property3;
  }

  toJSON() {
    return {
      entityId: this.entityId.toString(),
      property1: this.property1,
      property2: this.property2,
      property3: this.property3,
    };
  }
}

class StubInMemoryRepository extends InMemoryRepository<StubEntity, Uuid> {
  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity;
  }
}
describe("InMemoryRepository Unit Tests", () => {
  let repo: StubInMemoryRepository;

  beforeEach(() => {
    repo = new StubInMemoryRepository();
  });

  it("should insert an entity", async () => {
    const entity = new StubEntity({
      entityId: new Uuid(),
      property1: "property1",
      property2: 1,
      property3: true,
    });

    await repo.insert(entity);

    expect(repo.items).toContain(entity);
    expect(repo.items).toHaveLength(1);
  });

  it("should bulk insert entities", async () => {
    const entities = [
      new StubEntity({
        entityId: new Uuid(),
        property1: "property1",
        property2: 1,
        property3: true,
      }),
      new StubEntity({
        entityId: new Uuid(),
        property1: "property2",
        property2: 2,
        property3: false,
      }),
    ];

    await repo.bulkInsert(entities);

    expect(repo.items).toContain(entities[0]);
    expect(repo.items).toContain(entities[1]);
    expect(repo.items).toHaveLength(2);
  });

  it("should update an entity", async () => {
    const entity = new StubEntity({
      entityId: new Uuid(),
      property1: "property1",
      property2: 1,
      property3: true,
    });

    await repo.insert(entity);

    const updatedEntity = new StubEntity({
      entityId: entity.entityId,
      property1: "updatedProperty1",
      property2: 2,
      property3: false,
    });

    await repo.update(updatedEntity);

    expect(repo.items).toContain(updatedEntity);
    expect(repo.items).not.toContain(entity);
    expect(repo.items).toHaveLength(1);
  });

  it("should throw an error when updating an entity that does not exist", async () => {
    const entity = new StubEntity({
      entityId: new Uuid(),
      property1: "property1",
      property2: 1,
      property3: true,
    });

    await expect(repo.update(entity)).rejects.toThrow(
      new NotFoundError(entity.entityId, StubEntity)
    );
  });

  it("should delete an entity", async () => {
    const entity = new StubEntity({
      entityId: new Uuid(),
      property1: "property1",
      property2: 1,
      property3: true,
    });

    await repo.insert(entity);

    await repo.delete(entity.entityId);

    expect(repo.items).not.toContain(entity);
    expect(repo.items).toHaveLength(0);
  });

  it("should throw an error when deleting an entity that does not exist", async () => {
    const entityId = new Uuid();

    await expect(repo.delete(entityId)).rejects.toThrow(
      new NotFoundError(entityId, StubEntity)
    );
  });

  it("should find an entity by id", async () => {
    const entity = new StubEntity({
      entityId: new Uuid(),
      property1: "property1",
      property2: 1,
      property3: true,
    });

    await repo.insert(entity);

    const foundEntity = await repo.findById(entity.entityId);

    expect(foundEntity).toEqual(entity);
  });

  it("should return all entities", async () => {
    const entities = [
      new StubEntity({
        entityId: new Uuid(),
        property1: "property1",
        property2: 1,
        property3: true,
      }),
      new StubEntity({
        entityId: new Uuid(),
        property1: "property2",
        property2: 2,
        property3: false,
      }),
    ];

    await repo.bulkInsert(entities);

    const allEntities = await repo.findAll();

    expect(allEntities).toEqual(entities);
  });
});
