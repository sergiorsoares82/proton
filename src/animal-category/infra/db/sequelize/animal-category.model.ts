import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Gender } from "../../../domain/animal.aggregate";

@Table({
  tableName: "animal_categories",
  timestamps: false,
})
export class AnimalCategoryModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare animalCategoryId: number;

  @Column({ allowNull: false, type: DataType.STRING(255) })
  declare name: string;

  @Column({
    allowNull: false,
    type: DataType.ENUM(...Object.values(Gender)), // Converts enum to ENUM values
  })
  declare gender: Gender;

  @Column({ allowNull: false, type: DataType.BOOLEAN })
  declare isActive: boolean;

  @Column({ allowNull: false, type: DataType.DATE })
  declare createdAt: Date;
}
