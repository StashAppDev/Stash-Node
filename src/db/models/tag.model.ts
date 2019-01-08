import * as Sequelize from "sequelize";
import { Database } from "../database";
import { ISceneMarkerAttributes, ISceneMarkerInstance } from "./scene-markers.model";
import { ISceneAttributes, ISceneInstance } from "./scene.model";

export interface ITagAttributes {
  id?: number;
  name: string;
  primarySceneMarkers?: ISceneMarkerAttributes[] | Array<ISceneMarkerAttributes["id"]>;
  scenesMarkers?: ISceneMarkerAttributes[] | Array<ISceneMarkerAttributes["id"]>;
  scenes?: ISceneAttributes[] | Array<ISceneAttributes["id"]>;
}

export interface ITagInstance extends Sequelize.Instance<ITagAttributes>, ITagAttributes {
  getPrimarySceneMarkers: Sequelize.HasManyGetAssociationsMixin<ISceneMarkerInstance>;
  setPrimarySceneMarkers: Sequelize.HasManySetAssociationsMixin<ISceneMarkerInstance, ISceneMarkerInstance["id"]>;
  addPrimarySceneMarkers: Sequelize.HasManyAddAssociationsMixin<ISceneMarkerInstance, ISceneMarkerInstance["id"]>;
  addPrimarySceneMarker: Sequelize.HasManyAddAssociationMixin<ISceneMarkerInstance, ISceneMarkerInstance["id"]>;
  createPrimarySceneMarker: Sequelize.HasManyCreateAssociationMixin<ISceneMarkerAttributes, ISceneMarkerInstance["id"]>;
  removePrimarySceneMarker: Sequelize.HasManyRemoveAssociationMixin<ISceneMarkerInstance, ISceneMarkerInstance["id"]>;
  removePrimarySceneMarkers: Sequelize.HasManyRemoveAssociationsMixin<ISceneMarkerInstance, ISceneMarkerInstance["id"]>;
  hasPrimarySceneMarker: Sequelize.HasManyHasAssociationMixin<ISceneMarkerInstance, ISceneMarkerInstance["id"]>;
  hasPrimarySceneMarkers: Sequelize.HasManyHasAssociationsMixin<ISceneMarkerInstance, ISceneMarkerInstance["id"]>;
  countPrimarySceneMarkers: Sequelize.HasManyCountAssociationsMixin;

  getSceneMarkers: Sequelize.BelongsToManyGetAssociationsMixin<ISceneMarkerInstance>;
  setSceneMarkers:
    Sequelize.BelongsToManySetAssociationsMixin<ISceneMarkerInstance, ISceneMarkerInstance["id"], "scene_markers_tags">;
  addSceneMarkers:
    Sequelize.BelongsToManyAddAssociationsMixin<ISceneMarkerInstance, ISceneMarkerInstance["id"], "scene_markers_tags">;
  addSceneMarker:
    Sequelize.BelongsToManyAddAssociationMixin<ISceneMarkerInstance, ISceneMarkerInstance["id"], "scene_markers_tags">;
  createSceneMarker:
    Sequelize.BelongsToManyCreateAssociationMixin<ISceneMarkerAttributes, ISceneMarkerInstance["id"],
    "scene_markers_tags">;
  removeSceneMarker: Sequelize.BelongsToManyRemoveAssociationMixin<ISceneMarkerInstance, ISceneMarkerInstance["id"]>;
  removeSceneMarkers: Sequelize.BelongsToManyRemoveAssociationsMixin<ISceneMarkerInstance, ISceneMarkerInstance["id"]>;
  hasSceneMarker: Sequelize.BelongsToManyHasAssociationMixin<ISceneMarkerInstance, ISceneMarkerInstance["id"]>;
  hasSceneMarkers: Sequelize.BelongsToManyHasAssociationsMixin<ISceneMarkerInstance, ISceneMarkerInstance["id"]>;
  countSceneMarkers: Sequelize.BelongsToManyCountAssociationsMixin;

  getScenes: Sequelize.BelongsToManyGetAssociationsMixin<ISceneInstance>;
  setScenes: Sequelize.BelongsToManySetAssociationsMixin<ISceneInstance, ISceneInstance["id"], "scenes_tags">;
  addScenes: Sequelize.BelongsToManyAddAssociationsMixin<ISceneInstance, ISceneInstance["id"], "scenes_tags">;
  addScene: Sequelize.BelongsToManyAddAssociationMixin<ISceneInstance, ISceneInstance["id"], "scenes_tags">;
  removeScene: Sequelize.BelongsToManyRemoveAssociationMixin<ISceneInstance, ISceneInstance["id"]>;
  removeScenes: Sequelize.BelongsToManyRemoveAssociationsMixin<ISceneInstance, ISceneInstance["id"]>;
  hasScene: Sequelize.BelongsToManyHasAssociationMixin<ISceneInstance, ISceneInstance["id"]>;
  hasScenes: Sequelize.BelongsToManyHasAssociationsMixin<ISceneInstance, ISceneInstance["id"]>;
  countScenes: Sequelize.BelongsToManyCountAssociationsMixin;
}

export const TagFactory = (
  sequelize: Sequelize.Sequelize,
  DataTypes: Sequelize.DataTypes,
): Sequelize.Model<ITagInstance, ITagAttributes> => {
  const attributes: Sequelize.DefineModelAttributes<ITagAttributes> = {
    id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
  };

  const options: Sequelize.DefineOptions<ITagInstance> = {
    indexes: [
      { name: "index_tags_on_name", fields: ["name"] },
    ],
  };

  const Tag = sequelize.define<ITagInstance, ITagAttributes>("tags", attributes, options);

  Tag.associate = () => {
    Tag.hasMany(Database.SceneMarker, { as: "primary_scene_markers", foreignKey: "primary_tag_id" });
    Tag.belongsToMany(Database.SceneMarker, {
      as: "scene_markers", foreignKey: "tag_id", through: "scene_markers_tags",
    });
    Tag.belongsToMany(Database.Scene, { as: "scenes", through: "scenes_tags", foreignKey: "tag_id" });
  };

  return Tag;
};
