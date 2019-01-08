import * as Sequelize from "sequelize";
import { Database } from "../database";
import { IGalleryAttributes, IGalleryInstance } from "./gallery.model";
import { IPerformerAttributes, IPerformerInstance } from "./performer.model";
import { ISceneMarkerAttributes, ISceneMarkerInstance } from "./scene-markers.model";
import { IStudioAttributes, IStudioInstance } from "./studio.model";
import { ITagAttributes, ITagInstance } from "./tag.model";

export interface ISceneAttributes {
  id?: number;
  checksum?: string;
  title?: string;
  details?: string;
  url?: string;
  date?: string;
  rating?: number;
  path?: string;
  size?: string;
  duration?: number;
  videoCodec?: string;
  audioCodec?: string;
  width?: number;
  height?: number;
  createdAt?: Date;
  updatedAt?: Date;
  studio?: IStudioAttributes | IStudioAttributes["id"];
  gallery?: IGalleryAttributes | IGalleryAttributes["id"];
  tags?: ITagAttributes[] | Array<ITagAttributes["id"]>;
}

export interface ISceneInstance extends Sequelize.Instance<ISceneAttributes>, ISceneAttributes {
  getStudio: Sequelize.BelongsToGetAssociationMixin<IStudioInstance>;
  setStudio: Sequelize.BelongsToSetAssociationMixin<IStudioInstance, IStudioInstance["id"]>;
  createStudio: Sequelize.BelongsToCreateAssociationMixin<IStudioAttributes, IStudioInstance>;

  getGallery: Sequelize.HasOneGetAssociationMixin<IGalleryInstance>;
  setGallery: Sequelize.HasOneSetAssociationMixin<IGalleryInstance, IGalleryInstance["id"]>;
  createGallery: Sequelize.HasOneCreateAssociationMixin<IGalleryAttributes>;

  getPerformers: Sequelize.BelongsToManyGetAssociationsMixin<IPerformerInstance>;
  setPerformers:
    Sequelize.BelongsToManySetAssociationsMixin<IPerformerInstance, IPerformerInstance["id"], "scenes_tags">;
  addPerformers:
    Sequelize.BelongsToManyAddAssociationsMixin<IPerformerInstance, IPerformerInstance["id"], "scenes_tags">;
  addPerformer: Sequelize.BelongsToManyAddAssociationMixin<IPerformerInstance, IPerformerInstance["id"], "scenes_tags">;
  createPerformers:
    Sequelize.BelongsToManyCreateAssociationMixin<IPerformerAttributes, IPerformerInstance["id"], "scenes_tags">;
  removePerformer: Sequelize.BelongsToManyRemoveAssociationMixin<IPerformerInstance, IPerformerInstance["id"]>;
  removePerformers: Sequelize.BelongsToManyRemoveAssociationsMixin<IPerformerInstance, IPerformerInstance["id"]>;
  hasPerformer: Sequelize.BelongsToManyHasAssociationMixin<IPerformerInstance, IPerformerInstance["id"]>;
  hasPerformers: Sequelize.BelongsToManyHasAssociationsMixin<IPerformerInstance, IPerformerInstance["id"]>;
  countPerformers: Sequelize.BelongsToManyCountAssociationsMixin;

  getSceneMarkers: Sequelize.HasManyGetAssociationsMixin<ISceneMarkerInstance>;
  setSceneMarkers: Sequelize.HasManySetAssociationsMixin<ISceneMarkerInstance, ISceneMarkerInstance["id"]>;
  addSceneMarkers: Sequelize.HasManyAddAssociationsMixin<ISceneMarkerInstance, ISceneMarkerInstance["id"]>;
  addSceneMarker: Sequelize.HasManyAddAssociationMixin<ISceneMarkerInstance, ISceneMarkerInstance["id"]>;
  createSceneMarkers: Sequelize.HasManyCreateAssociationMixin<ISceneMarkerAttributes, ISceneMarkerInstance["id"]>;
  removeSceneMarker: Sequelize.HasManyRemoveAssociationMixin<ISceneMarkerInstance, ISceneMarkerInstance["id"]>;
  removeSceneMarkers: Sequelize.HasManyRemoveAssociationsMixin<ISceneMarkerInstance, ISceneMarkerInstance["id"]>;
  hasSceneMarker: Sequelize.HasManyHasAssociationMixin<ISceneMarkerInstance, ISceneMarkerInstance["id"]>;
  hasSceneMarkers: Sequelize.HasManyHasAssociationsMixin<ISceneMarkerInstance, ISceneMarkerInstance["id"]>;
  countSceneMarkers: Sequelize.HasManyCountAssociationsMixin;

  getTags: Sequelize.BelongsToManyGetAssociationsMixin<ITagInstance>;
  setTags: Sequelize.BelongsToManySetAssociationsMixin<ITagInstance, ITagInstance["id"], "scenes_tags">;
  addTags: Sequelize.BelongsToManyAddAssociationsMixin<ITagInstance, ITagInstance["id"], "scenes_tags">;
  addTag: Sequelize.BelongsToManyAddAssociationMixin<ITagInstance, ITagInstance["id"], "scenes_tags">;
  createTags: Sequelize.BelongsToManyCreateAssociationMixin<ITagAttributes, ITagInstance["id"], "scenes_tags">;
  removeTag: Sequelize.BelongsToManyRemoveAssociationMixin<ITagInstance, ITagInstance["id"]>;
  removeTags: Sequelize.BelongsToManyRemoveAssociationsMixin<ITagInstance, ITagInstance["id"]>;
  hasTag: Sequelize.BelongsToManyHasAssociationMixin<ITagInstance, ITagInstance["id"]>;
  hasTags: Sequelize.BelongsToManyHasAssociationsMixin<ITagInstance, ITagInstance["id"]>;
  countTags: Sequelize.BelongsToManyCountAssociationsMixin;
}

export const SceneFactory = (
  sequelize: Sequelize.Sequelize,
  DataTypes: Sequelize.DataTypes,
): Sequelize.Model<ISceneInstance, ISceneAttributes> => {
  // tslint:disable:object-literal-sort-keys
  const attributes: Sequelize.DefineModelAttributes<ISceneAttributes> = {
    id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    checksum: { type: DataTypes.STRING, allowNull: false, unique: true },
    title: { type: DataTypes.STRING },
    details: { type: DataTypes.TEXT },
    url: { type: DataTypes.STRING },
    date: { type: DataTypes.STRING }, // TODO: date?
    rating: { type: DataTypes.TINYINT },
    path: { type: DataTypes.STRING, allowNull: false, unique: true },
    size: { type: DataTypes.STRING, allowNull: false },
    duration: { type: DataTypes.DECIMAL({ precision: 7, scale: 2 }), allowNull: false },
    videoCodec: { type: DataTypes.STRING, allowNull: false, field: "video_codec" },
    audioCodec: { type: DataTypes.STRING, allowNull: false, field: "audio_codec" },
    width: { type: DataTypes.TINYINT, allowNull: false },
    height: { type: DataTypes.TINYINT, allowNull: false },
  };
  // tslint:enable:object-literal-sort-keys

  const options: Sequelize.DefineOptions<ISceneInstance> = {
    indexes: [
      { name: "index_scenes_on_studio_id", fields: ["studio_id"] },
      { name: "index_scenes_on_path", fields: ["path"], unique: true },
      { name: "index_scenes_on_checksum", fields: ["checksum"] },
    ],
  };

  const Scene = sequelize.define<ISceneInstance, ISceneAttributes>("scenes", attributes, options);

  Scene.associate = () => {
    Scene.hasOne(Database.Gallery, { as: "gallery", foreignKey: "scene_id" });
    // TODO: Test this deletes all markers
    Scene.hasMany(Database.SceneMarker, { as: "scene_markers", foreignKey: "scene_id", onDelete: "CASCADE" });
    Scene.belongsTo(Database.Studio, { as: "studio", foreignKey: "studio_id" });
    Scene.belongsToMany(Database.Tag, { as: "tags", through: "scenes_tags", foreignKey: "scene_id" });
    Scene.belongsToMany(Database.Performer, { as: "scenes", through: "performers_scenes", foreignKey: "scene_id" });
  };

  return Scene;
};

export const AddSceneScopes = () => {
  const fullScope: Sequelize.AnyFindOptions = {
    include: [{ model: Database.Studio, as: "studio" }],
  };
  Database.Scene.addScope("defaultScope", fullScope);
};
