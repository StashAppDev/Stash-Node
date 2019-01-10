import * as Sequelize from "sequelize";
import { Database } from "../database";
import { IGalleryAttributes, IGalleryInstance } from "./gallery.model";
import { IPerformerAttributes, IPerformerInstance } from "./performer.model";
import { ISceneMarkerAttributes, ISceneMarkerInstance } from "./scene-marker.model";
import { IStudioAttributes, IStudioInstance } from "./studio.model";
import { ITagAttributes, ITagInstance } from "./tag.model";
import { Op } from "sequelize";
import { ResolutionEnum } from "../../typings/graphql";

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
  framerate?: number;
  bitrate?: number;
  createdAt?: Date;
  updatedAt?: Date;
  performers?: IPerformerAttributes[] | Array<IPerformerAttributes["id"]>;
  sceneMarkers?: ISceneMarkerAttributes[] | Array<ISceneMarkerAttributes["id"]>;
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
    Sequelize.BelongsToManySetAssociationsMixin<IPerformerInstance, IPerformerInstance["id"], "performers_scenes">;
  addPerformers:
    Sequelize.BelongsToManyAddAssociationsMixin<IPerformerInstance, IPerformerInstance["id"], "performers_scenes">;
  addPerformer:
    Sequelize.BelongsToManyAddAssociationMixin<IPerformerInstance, IPerformerInstance["id"], "performers_scenes">;
  createPerformers:
    Sequelize.BelongsToManyCreateAssociationMixin<IPerformerAttributes, IPerformerInstance["id"], "performers_scenes">;
  removePerformer: Sequelize.BelongsToManyRemoveAssociationMixin<IPerformerInstance, IPerformerInstance["id"]>;
  removePerformers: Sequelize.BelongsToManyRemoveAssociationsMixin<IPerformerInstance, IPerformerInstance["id"]>;
  hasPerformer: Sequelize.BelongsToManyHasAssociationMixin<IPerformerInstance, IPerformerInstance["id"]>;
  hasPerformers: Sequelize.BelongsToManyHasAssociationsMixin<IPerformerInstance, IPerformerInstance["id"]>;
  countPerformers: Sequelize.BelongsToManyCountAssociationsMixin;

  getScene_markers: Sequelize.HasManyGetAssociationsMixin<ISceneMarkerInstance>;
  setScene_markers: Sequelize.HasManySetAssociationsMixin<ISceneMarkerInstance, ISceneMarkerInstance["id"]>;
  addScene_markers: Sequelize.HasManyAddAssociationsMixin<ISceneMarkerInstance, ISceneMarkerInstance["id"]>;
  addScene_marker: Sequelize.HasManyAddAssociationMixin<ISceneMarkerInstance, ISceneMarkerInstance["id"]>;
  createScene_marker: Sequelize.HasManyCreateAssociationMixin<ISceneMarkerAttributes, ISceneMarkerInstance["id"]>;
  removeScene_marker: Sequelize.HasManyRemoveAssociationMixin<ISceneMarkerInstance, ISceneMarkerInstance["id"]>;
  removeScene_markers: Sequelize.HasManyRemoveAssociationsMixin<ISceneMarkerInstance, ISceneMarkerInstance["id"]>;
  hasScene_marker: Sequelize.HasManyHasAssociationMixin<ISceneMarkerInstance, ISceneMarkerInstance["id"]>;
  hasScene_markers: Sequelize.HasManyHasAssociationsMixin<ISceneMarkerInstance, ISceneMarkerInstance["id"]>;
  countScene_markers: Sequelize.HasManyCountAssociationsMixin;

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
    size: { type: DataTypes.STRING },
    duration: { type: DataTypes.DECIMAL({ precision: 7, scale: 2 }) },
    videoCodec: { type: DataTypes.STRING, field: "video_codec" },
    audioCodec: { type: DataTypes.STRING, field: "audio_codec" },
    width: { type: DataTypes.TINYINT},
    height: { type: DataTypes.TINYINT },
    framerate: { type: DataTypes.DECIMAL({ precision: 7, scale: 2 }) },
    bitrate: { type: DataTypes.INTEGER },
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
    Scene.belongsToMany(Database.Performer, { as: "performers", through: "performers_scenes", foreignKey: "scene_id" });
  };

  return Scene;
};

export const AddSceneScopes = () => {
  const fullScope: Sequelize.FindOptions<ISceneAttributes> = {
    include: [{ model: Database.Studio, as: "studio" }],
  };

  const resolution = (value: ResolutionEnum): Sequelize.FindOptions<ISceneAttributes> => {
    switch (value) {
      case "LOW": return { where: { height: { [Op.gte]: 240, [Op.lt]: 480 } } };
      case "STANDARD": return { where: { height: { [Op.gte]: 480, [Op.lt]: 720 } } };
      case "STANDARD_HD": return { where: { height: { [Op.gte]: 720, [Op.lt]: 1080 } } };
      case "FULL_HD": return { where: { height: { [Op.gte]: 1080, [Op.lt]: 2160 } } };
      case "FOUR_K": return { where: { height: { [Op.gte]: 2160 } } };
      default: return { where: { height: { [Op.lt]: 240 } } };
    }
  };

  Database.Scene.addScope("defaultScope", fullScope);
  Database.Scene.addScope("resolution", resolution);
};
