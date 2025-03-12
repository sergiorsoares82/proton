import { Op } from "sequelize";
import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { AnimalCategory } from "../../../domain/animal-category.aggregate";
import {
  AnimalCategorySearchParams,
  AnimalCategorySearchResult,
  IAnimalCategoryRepository,
} from "../../../domain/animal-category.repository";
import type { AnimalCategoryModel } from "./animal-category.model";

export class AnimalCategorySequelizeRepository
  implements IAnimalCategoryRepository
{
  sortableFields: string[] = ["name", "createdAt"];

  constructor(private animalCategoryModel: typeof AnimalCategoryModel) {}

  async insert(entity: AnimalCategory): Promise<void> {
    await this.animalCategoryModel.create({
      animalCategoryId: entity.animalCategoryId.id,
      name: entity.name,
      gender: entity.gender,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
    });
  }

  async bulkInsert(entities: AnimalCategory[]): Promise<void> {
    await this.animalCategoryModel.bulkCreate(
      entities.map((entity) => ({
        animalCategoryId: entity.animalCategoryId.id,
        name: entity.name,
        gender: entity.gender,
        isActive: entity.isActive,
        createdAt: entity.createdAt,
      }))
    );
  }

  async update(entity: AnimalCategory): Promise<void> {
    const id = entity.animalCategoryId.id;
    const model = await this._get(id);

    if (!model) {
      throw new NotFoundError(id, this.getEntity());
    }

    await model.update(
      {
        animalCategoryId: entity.animalCategoryId.id,
        name: entity.name,
        gender: entity.gender,
        isActive: entity.isActive,
        createdAt: entity.createdAt,
      },
      { where: { animalCategoryId: id } }
    );
  }

  async delete(entityId: Uuid): Promise<void> {
    const id = entityId.id;
    const model = await this._get(id);

    if (!model) {
      throw new NotFoundError(id, this.getEntity());
    }

    await this.animalCategoryModel.destroy({ where: { animalCategoryId: id } });
  }

  async findById(entityId: Uuid): Promise<AnimalCategory> {
    const model = await this.animalCategoryModel.findByPk(entityId.id);
    return new AnimalCategory({
      animalCategoryId: new Uuid(model.animalCategoryId),
      name: model.name,
      gender: model.gender,
      isActive: model.isActive,
      createdAt: model.createdAt,
    });
  }

  findAll(): Promise<AnimalCategory[]> {
    throw new Error("Method not implemented.");
  }

  async search(
    props: AnimalCategorySearchParams
  ): Promise<AnimalCategorySearchResult> {
    const offset = (props.page - 1) * props.per_page;
    const limit = props.per_page;
    const { rows: models, count } =
      await this.animalCategoryModel.findAndCountAll({
        ...(props.filter && {
          where: {
            name: { [Op.like]: `%${props.filter}%` },
          },
        }),
        ...(props.sort && this.sortableFields.includes(props.sort)
          ? { order: [[props.sort, props.sort_dir]] }
          : { order: [["created_at", "desc"]] }),
        offset,
        limit,
      });
    return new AnimalCategorySearchResult({
      items: models.map((model) => {
        return new AnimalCategory({
          animalCategoryId: new Uuid(model.animalCategoryId),
          name: model.name,
          gender: model.gender,
          isActive: model.isActive,
          createdAt: model.createdAt,
        });
      }),
      current_page: props.page,
      per_page: props.per_page,
      total: count,
    });
  }

  private async _get(id: string) {
    return await this.animalCategoryModel.findByPk(id);
  }

  getEntity(): new (...args: any[]) => AnimalCategory {
    return AnimalCategory;
  }
}
