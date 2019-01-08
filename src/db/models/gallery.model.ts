import * as Sequelize from "sequelize";
import { Database } from "../database";
import { ISceneAttributes, ISceneInstance } from "./scene.model";

export interface IGalleryAttributes {
  id?: number;
  path?: string;
  checksum?: string;
  createdAt?: Date;
  updatedAt?: Date;
  scene?: ISceneAttributes | ISceneAttributes["id"];
}

export interface IGalleryInstance extends Sequelize.Instance<IGalleryAttributes>, IGalleryAttributes {
  getScene: Sequelize.BelongsToGetAssociationMixin<ISceneInstance>;
  setScene: Sequelize.BelongsToSetAssociationMixin<ISceneInstance, ISceneInstance["id"]>;
  createScene: Sequelize.BelongsToCreateAssociationMixin<ISceneAttributes, ISceneInstance>;
}

export const GalleryFactory = (
  sequelize: Sequelize.Sequelize,
  DataTypes: Sequelize.DataTypes,
): Sequelize.Model<IGalleryInstance, IGalleryAttributes> => {
  // tslint:disable:object-literal-sort-keys
  const attributes: Sequelize.DefineModelAttributes<IGalleryAttributes> = {
    id:       { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    checksum: { type: DataTypes.STRING, allowNull: false, unique: true },
    path:     { type: DataTypes.STRING, allowNull: false, unique: true },
  };
  // tslint:enable:object-literal-sort-keys

  const options: Sequelize.DefineOptions<IGalleryInstance> = {
    indexes: [
      { name: "index_galleries_on_scene_id", fields: ["scene_id"] },
    ],
  };

  const Gallery = sequelize.define<IGalleryInstance, IGalleryAttributes>("galleries", attributes, options);

  Gallery.associate = () => {
    Gallery.belongsTo(Database.Scene, { as: "scene", foreignKey: "scene_id" });
  };

  return Gallery;
};
