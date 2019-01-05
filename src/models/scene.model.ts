import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  DefaultScope,
  ForeignKey,
  IScopeFindOptions,
  Model,
  PrimaryKey,
  Scopes,
  Table,
  Unique,
} from "sequelize-typescript";
import { Studio } from "./studio.model";

const fullScope: IScopeFindOptions = {
  include: [() => Studio],
};

@DefaultScope(fullScope)
@Scopes({ full: fullScope })
@Table({ tableName: "scenes" })
export class Scene extends Model<Scene> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.INTEGER)
  public id: number;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  public checksum: string;

  @Column(DataType.STRING)
  public title?: string;

  @Column(DataType.STRING)
  public details?: string;

  @Column(DataType.STRING)
  public url?: string;

  @Column(DataType.STRING)
  public date?: string;

  @Column(DataType.TINYINT)
  public rating?: number;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  public path: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  public size: string;

  @AllowNull(false)
  @Column(DataType.DECIMAL({ precision: 7, scale: 2 }))
  public duration: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: "video_codec" })
  public videoCodec: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, field: "audio_codec" })
  public audioCodec: string;

  @AllowNull(false)
  @Column(DataType.TINYINT)
  public width: number;

  @AllowNull(false)
  @Column(DataType.TINYINT)
  public height: number;

  @ForeignKey(() => Studio)
  @Column({ type: DataType.INTEGER, field: "studio_id" })
  public studioId: number;

  @BelongsTo(() => Studio, "studio_id")
  public studio: Studio;

  // @OneToOne()
  // public gallery: GalleryEntity;
}
