import { Op } from 'sequelize';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { AnimalCategory } from '../../../domain/animal-category.aggregate';
import {
  AnimalCategorySearchParams,
  AnimalCategorySearchResult,
  IAnimalCategoryRepository,
} from '../../../domain/animal-category.repository';
import { AnimalCategoryModel } from './animal-category.model';
import { AnimalCategoryModelMapper } from './animal-category-model.mapper';

export class AnimalCategorySequelizeRepository
  implements IAnimalCategoryRepository
{
  sortableFields: string[] = ['name', 'createdAt'];

  constructor(private animalCategoryModel: typeof AnimalCategoryModel) {}

  async insert(entity: AnimalCategory): Promise<void> {
    const model = AnimalCategoryModelMapper.toModel(entity).toJSON();
    await this.animalCategoryModel.create(model);
  }

  async bulkInsert(entities: AnimalCategory[]): Promise<void> {
    const models = entities.map((entity) => {
      return AnimalCategoryModelMapper.toModel(entity).toJSON();
    });
    await this.animalCategoryModel.bulkCreate(models);
  }

  async update(entity: AnimalCategory): Promise<void> {
    const id = entity.animalCategoryId.id;
    const model = await this.animalCategoryModel.findByPk(id);

    if (!model) {
      throw new NotFoundError(id, this.getEntity());
    }

    const modelToUpdate = AnimalCategoryModelMapper.toModel(entity).toJSON();

    await model.update(modelToUpdate, { where: { animalCategoryId: id } });
  }

  async delete(entityId: Uuid): Promise<void> {
    const id = entityId.id;
    const model = await this.animalCategoryModel.findByPk(id);

    if (!model) {
      throw new NotFoundError(id, this.getEntity());
    }

    await this.animalCategoryModel.destroy({ where: { animalCategoryId: id } });
  }

  async findById(entityId: Uuid): Promise<AnimalCategory> {
    const model = await this.animalCategoryModel.findByPk(entityId.id);

    return model ? AnimalCategoryModelMapper.toEntity(model) : null;
  }

  async findAll(): Promise<AnimalCategory[]> {
    const models = await this.animalCategoryModel.findAll();
    return models.map((model) => {
      return AnimalCategoryModelMapper.toEntity(model);
    });
  }

  async search(
    props: AnimalCategorySearchParams,
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
          : { order: [['createdAt', 'desc']] }),
        offset,
        limit,
      });
    return new AnimalCategorySearchResult({
      items: models.map((model) => {
        return AnimalCategoryModelMapper.toEntity(model);
      }),
      current_page: props.page,
      per_page: props.per_page,
      total: count,
    });
  }

  // private async _get(id: string) {
  //   return await this.animalCategoryModel.findByPk(id);
  // }

  getEntity(): new (...args: any[]) => AnimalCategory {
    return AnimalCategory;
  }
}
