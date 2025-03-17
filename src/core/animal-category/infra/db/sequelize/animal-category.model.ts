import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Gender } from '../../../domain/animal.aggregate';

export type AnimalCategoryModelProps = {
  animalCategoryId: string;
  name: string;
  gender: string;
  isActive: boolean;
  createdAt: Date;
};

@Table({
  tableName: 'animal_categories',
  timestamps: false,
})
export class AnimalCategoryModel extends Model<AnimalCategoryModelProps> {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare animalCategoryId: string;

  @Column({ allowNull: false, type: DataType.STRING(255) })
  declare name: string;

  @Column({
    allowNull: false,
    type: DataType.ENUM(...Object.values(Gender)), // Converts enum to ENUM values
  })
  declare gender: string;

  @Column({ allowNull: false, type: DataType.BOOLEAN })
  declare isActive: boolean;

  @Column({ allowNull: false, type: DataType.DATE(3) })
  declare createdAt: Date;
}
