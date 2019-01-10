import * as Sequelize from "sequelize";
import { Database } from "../database";
import { ISceneMarkerAttributes, ISceneMarkerInstance } from "./scene-marker.model";
import { ISceneAttributes, ISceneInstance } from "./scene.model";

export interface ITagAttributes {
  id?: number;
  name: string;
  primarySceneMarkers?: ISceneMarkerAttributes[] | Array<ISceneMarkerAttributes["id"]>;
  scenesMarkers?: ISceneMarkerAttributes[] | Array<ISceneMarkerAttributes["id"]>;
  scenes?: ISceneAttributes[] | Array<ISceneAttributes["id"]>;
}

export interface ITagInstance extends Sequelize.Instance<ITagAttributes>, ITagAttributes {
  getPrimary_scene_markers: Sequelize.HasManyGetAssociationsMixin<ISceneMarkerInstance>;
  setPrimary_scene_markers: Sequelize.HasManySetAssociationsMixin<ISceneMarkerInstance, ISceneMarkerInstance["id"]>;
  addPrimary_scene_markers: Sequelize.HasManyAddAssociationsMixin<ISceneMarkerInstance, ISceneMarkerInstance["id"]>;
  addPrimary_scene_marker: Sequelize.HasManyAddAssociationMixin<ISceneMarkerInstance, ISceneMarkerInstance["id"]>;
  createPrimary_scene_marker:
    Sequelize.HasManyCreateAssociationMixin<ISceneMarkerAttributes, ISceneMarkerInstance["id"]>;
  removePrimary_scene_marker: Sequelize.HasManyRemoveAssociationMixin<ISceneMarkerInstance, ISceneMarkerInstance["id"]>;
  removePrimary_scene_markers:
    Sequelize.HasManyRemoveAssociationsMixin<ISceneMarkerInstance, ISceneMarkerInstance["id"]>;
  hasPrimary_scene_marker: Sequelize.HasManyHasAssociationMixin<ISceneMarkerInstance, ISceneMarkerInstance["id"]>;
  hasPrimary_scene_markers: Sequelize.HasManyHasAssociationsMixin<ISceneMarkerInstance, ISceneMarkerInstance["id"]>;
  countPrimary_scene_markers: Sequelize.HasManyCountAssociationsMixin;

  getScene_markers: Sequelize.BelongsToManyGetAssociationsMixin<ISceneMarkerInstance>;
  setScene_markers:
    Sequelize.BelongsToManySetAssociationsMixin<ISceneMarkerInstance, ISceneMarkerInstance["id"], "scene_markers_tags">;
  addScene_markers:
    Sequelize.BelongsToManyAddAssociationsMixin<ISceneMarkerInstance, ISceneMarkerInstance["id"], "scene_markers_tags">;
  addScene_marker:
    Sequelize.BelongsToManyAddAssociationMixin<ISceneMarkerInstance, ISceneMarkerInstance["id"], "scene_markers_tags">;
  createScene_marker:
    Sequelize.BelongsToManyCreateAssociationMixin<ISceneMarkerAttributes, ISceneMarkerInstance["id"],
    "scene_markers_tags">;
  removeSceneMarker: Sequelize.BelongsToManyRemoveAssociationMixin<ISceneMarkerInstance, ISceneMarkerInstance["id"]>;
  removeScene_markers: Sequelize.BelongsToManyRemoveAssociationsMixin<ISceneMarkerInstance, ISceneMarkerInstance["id"]>;
  hasScene_marker: Sequelize.BelongsToManyHasAssociationMixin<ISceneMarkerInstance, ISceneMarkerInstance["id"]>;
  hasScene_markers: Sequelize.BelongsToManyHasAssociationsMixin<ISceneMarkerInstance, ISceneMarkerInstance["id"]>;
  countScene_markers: Sequelize.BelongsToManyCountAssociationsMixin;

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
