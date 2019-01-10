import * as Sequelize from "sequelize";
import { Database } from "../database";
import { ISceneAttributes, ISceneInstance } from "./scene.model";
import { ITagAttributes, ITagInstance } from "./tag.model";

export interface ISceneMarkerAttributes {
  id?: number;
  title: string;
  seconds?: number;
  createdAt?: Date;
  updatedAt?: Date;
  primaryTag?: ITagAttributes | ITagAttributes["id"];
  tags?: ITagAttributes[] | Array<ITagAttributes["id"]>;
  scene?: ISceneAttributes | ISceneAttributes["id"];
}

export interface ISceneMarkerInstance extends Sequelize.Instance<ISceneMarkerAttributes>, ISceneMarkerAttributes {
  getPrimary_tag: Sequelize.BelongsToGetAssociationMixin<ITagInstance>;
  setPrimary_tag: Sequelize.BelongsToSetAssociationMixin<ITagInstance, ITagInstance["id"]>;
  createPrimary_tag: Sequelize.BelongsToCreateAssociationMixin<ITagAttributes, ITagInstance>;

  getTags: Sequelize.BelongsToManyGetAssociationsMixin<ITagInstance>;
  setTags: Sequelize.BelongsToManySetAssociationsMixin<ITagInstance, ITagInstance["id"], "scene_markers_tags">;
  addTags: Sequelize.BelongsToManyAddAssociationsMixin<ITagInstance, ITagInstance["id"], "scene_markers_tags">;
  addTag: Sequelize.BelongsToManyAddAssociationMixin<ITagInstance, ITagInstance["id"], "scene_markers_tags">;
  createTags: Sequelize.BelongsToManyCreateAssociationMixin<ITagAttributes, ITagInstance["id"], "scene_markers_tags">;
  removeTag: Sequelize.BelongsToManyRemoveAssociationMixin<ITagInstance, ITagInstance["id"]>;
  removeTags: Sequelize.BelongsToManyRemoveAssociationsMixin<ITagInstance, ITagInstance["id"]>;
  hasTag: Sequelize.BelongsToManyHasAssociationMixin<ITagInstance, ITagInstance["id"]>;
  hasTags: Sequelize.BelongsToManyHasAssociationsMixin<ITagInstance, ITagInstance["id"]>;
  countTags: Sequelize.BelongsToManyCountAssociationsMixin;

  getScene: Sequelize.BelongsToGetAssociationMixin<ISceneInstance>;
  setScene: Sequelize.BelongsToSetAssociationMixin<ISceneInstance, ISceneInstance["id"]>;
  createScene: Sequelize.BelongsToCreateAssociationMixin<ISceneAttributes, ISceneInstance>;
}

export const SceneMarkerFactory = (
  sequelize: Sequelize.Sequelize,
  DataTypes: Sequelize.DataTypes,
): Sequelize.Model<ISceneMarkerInstance, ISceneMarkerAttributes> => {
  // tslint:disable:object-literal-sort-keys
  const attributes: Sequelize.DefineModelAttributes<ISceneMarkerAttributes> = {
    id:       { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    title:    { type: DataTypes.STRING, allowNull: false },
    seconds:  { type: DataTypes.DECIMAL, allowNull: false},
  };
  // tslint:enable:object-literal-sort-keys

  const options: Sequelize.DefineOptions<ISceneMarkerInstance> = {
    indexes: [
      { name: "index_scene_markers_on_primary_tag_id", fields: ["primary_tag_id"] },
      { name: "index_scene_markers_on_scene_id", fields: ["scene_id"] },
    ],
  };

  const SceneMarker =
    sequelize.define<ISceneMarkerInstance, ISceneMarkerAttributes>("scene_markers", attributes, options);

  SceneMarker.associate = () => {
    SceneMarker.belongsTo(Database.Tag, { as: "primary_tag", foreignKey: "primary_tag_id" });
    SceneMarker.belongsToMany(Database.Tag, {
      as: "tags", foreignKey: "scene_marker_id", through: "scene_markers_tags",
    });
    SceneMarker.belongsTo(Database.Scene, { as: "scene", foreignKey: "scene_id" });
  };

  return SceneMarker;
};
