// tslint:disable:object-literal-sort-keys
import * as Sequelize from "sequelize";
import { SequelizeAttributes } from "../../typings/sequelize-attributes";
import { ISceneAttributes, ISceneInstance } from "./scene.model";

export interface ITagAttributes {
  id?: number;
  name: string;
  scenes?: ISceneAttributes[] | Array<ISceneAttributes["id"]>;
}

export interface ITagInstance extends Sequelize.Instance<ITagAttributes>, ITagAttributes {
  getScenes: Sequelize.BelongsToManyGetAssociationsMixin<ISceneInstance>;
  setScenes: Sequelize.BelongsToManySetAssociationsMixin<ISceneInstance, ISceneInstance["id"], "scene_tags">;
  addScenes: Sequelize.BelongsToManyAddAssociationsMixin<ISceneInstance, ISceneInstance["id"], "scene_tags">;
  addScene: Sequelize.BelongsToManyAddAssociationMixin<ISceneInstance, ISceneInstance["id"], "scene_tags">;
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
  const attributes: SequelizeAttributes<ITagAttributes> = {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
  };

  const Tag = sequelize.define<ITagInstance, ITagAttributes>("tags", attributes);

  Tag.associate = (models) => {
    Tag.belongsToMany(models.scenes, { as: "scenes", through: "scene_tags", foreignKey: "tag_id" });
  };

  return Tag;
};
