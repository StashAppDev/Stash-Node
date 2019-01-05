import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import { Scene } from "./scene.model";

@Table({ tableName: "studios" })
export class Studio extends Model<Studio> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.INTEGER)
  public id: number;

  @AllowNull(false)
  @Column(DataType.BLOB)
  public image: Buffer;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  public checksum: string;

  @Column(DataType.STRING)
  public name?: string | null;

  @Column(DataType.STRING)
  public url?: string | null;

  @HasMany(() => Scene)
  public scenes: Scene[];
}
