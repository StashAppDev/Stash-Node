// tslint:disable:object-literal-sort-keys
import * as Sequelize from "sequelize";
import { SequelizeAttributes } from "../../typings/sequelize-attributes";
import { ISceneAttributes, ISceneInstance } from "./scene.model";

export interface IStudioAttributes {
  id?: number;
  image?: Buffer;
  checksum?: string;
  name?: string;
  url?: string;
  createdAt?: Date;
  updatedAt?: Date;
  scenes?: ISceneAttributes[] | Array<ISceneAttributes["id"]>;
}

export interface IStudioInstance extends Sequelize.Instance<IStudioAttributes>, IStudioAttributes {
  getScenes: Sequelize.HasManyGetAssociationsMixin<ISceneInstance>;
  setScenes: Sequelize.HasManySetAssociationsMixin<ISceneInstance, ISceneInstance["id"]>;
  addScenes: Sequelize.HasManyAddAssociationsMixin<ISceneInstance, ISceneInstance["id"]>;
  addScene: Sequelize.HasManyAddAssociationMixin<ISceneInstance, ISceneInstance["id"]>;
  createScenes: Sequelize.HasManyCreateAssociationMixin<ISceneInstance, ISceneInstance["id"]>;
  removeScene: Sequelize.HasManyRemoveAssociationMixin<ISceneInstance, ISceneInstance["id"]>;
  removeScenes: Sequelize.HasManyRemoveAssociationsMixin<ISceneInstance, ISceneInstance["id"]>;
  hasScene: Sequelize.HasManyHasAssociationMixin<ISceneInstance, ISceneInstance["id"]>;
  hasScenes: Sequelize.HasManyHasAssociationsMixin<ISceneInstance, ISceneInstance["id"]>;
  countScenes: Sequelize.HasManyCountAssociationsMixin;
}

export const StudioFactory = (
  sequelize: Sequelize.Sequelize,
  DataTypes: Sequelize.DataTypes,
): Sequelize.Model<IStudioInstance, IStudioAttributes> => {
  const attributes: SequelizeAttributes<IStudioAttributes> = {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    image: {
      allowNull: false,
      type: DataTypes.BLOB,
    },
    checksum: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
    name: { type: DataTypes.STRING },
    url: { type: DataTypes.STRING },
  };

  const Studio = sequelize.define<IStudioInstance, IStudioAttributes>("studios", attributes);

  Studio.associate = (models) => {
    Studio.hasMany(models.scenes, { as: "scene" });
  };

  return Studio;
};
