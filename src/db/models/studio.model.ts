import * as Sequelize from "sequelize";
import { Database } from "../database";
import { ISceneAttributes, ISceneInstance } from "./scene.model";
import { IScrapedItemAttributes, IScrapedItemInstance } from "./scraped-item";

export interface IStudioAttributes {
  id?: number;
  image?: Buffer;
  checksum?: string;
  name?: string;
  url?: string;
  createdAt?: Date;
  updatedAt?: Date;
  scenes?: ISceneAttributes[] | Array<ISceneAttributes["id"]>;
  scrapedItems?: IScrapedItemAttributes[] | Array<IScrapedItemAttributes["id"]>;
}

export interface IStudioInstance extends Sequelize.Instance<IStudioAttributes>, IStudioAttributes {
  getScenes: Sequelize.HasManyGetAssociationsMixin<ISceneInstance>;
  setScenes: Sequelize.HasManySetAssociationsMixin<ISceneInstance, ISceneInstance["id"]>;
  addScenes: Sequelize.HasManyAddAssociationsMixin<ISceneInstance, ISceneInstance["id"]>;
  addScene: Sequelize.HasManyAddAssociationMixin<ISceneInstance, ISceneInstance["id"]>;
  createScene: Sequelize.HasManyCreateAssociationMixin<ISceneAttributes, ISceneInstance["id"]>;
  removeScene: Sequelize.HasManyRemoveAssociationMixin<ISceneInstance, ISceneInstance["id"]>;
  removeScenes: Sequelize.HasManyRemoveAssociationsMixin<ISceneInstance, ISceneInstance["id"]>;
  hasScene: Sequelize.HasManyHasAssociationMixin<ISceneInstance, ISceneInstance["id"]>;
  hasScenes: Sequelize.HasManyHasAssociationsMixin<ISceneInstance, ISceneInstance["id"]>;
  countScenes: Sequelize.HasManyCountAssociationsMixin;

  getScrapedItems: Sequelize.HasManyGetAssociationsMixin<IScrapedItemInstance>;
  setScrapedItems: Sequelize.HasManySetAssociationsMixin<IScrapedItemInstance, IScrapedItemInstance["id"]>;
  addScrapedItems: Sequelize.HasManyAddAssociationsMixin<IScrapedItemInstance, IScrapedItemInstance["id"]>;
  addScrapedItem: Sequelize.HasManyAddAssociationMixin<IScrapedItemInstance, IScrapedItemInstance["id"]>;
  createScrapedItem: Sequelize.HasManyCreateAssociationMixin<IScrapedItemAttributes, IScrapedItemInstance["id"]>;
  removeScrapedItem: Sequelize.HasManyRemoveAssociationMixin<IScrapedItemInstance, IScrapedItemInstance["id"]>;
  removeScrapedItems: Sequelize.HasManyRemoveAssociationsMixin<IScrapedItemInstance, IScrapedItemInstance["id"]>;
  hasScrapedItem: Sequelize.HasManyHasAssociationMixin<IScrapedItemInstance, IScrapedItemInstance["id"]>;
  hasScrapedItems: Sequelize.HasManyHasAssociationsMixin<IScrapedItemInstance, IScrapedItemInstance["id"]>;
  countScrapedItems: Sequelize.HasManyCountAssociationsMixin;
}

export const StudioFactory = (
  sequelize: Sequelize.Sequelize,
  DataTypes: Sequelize.DataTypes,
): Sequelize.Model<IStudioInstance, IStudioAttributes> => {
  // tslint:disable:object-literal-sort-keys
  const attributes: Sequelize.DefineModelAttributes<IStudioAttributes> = {
    id:       { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    image:    { type: DataTypes.BLOB, allowNull: false },
    checksum: { type: DataTypes.STRING, allowNull: false, unique: true },
    name:     { type: DataTypes.STRING },
    url:      { type: DataTypes.STRING },
  };
  // tslint:enable:object-literal-sort-keys

  const options: Sequelize.DefineOptions<IStudioInstance> = {
    indexes: [
      { name: "index_studios_on_checksum", fields: ["checksum"] },
      { name: "index_studios_on_name", fields: ["name"] },
    ],
  };

  const Studio = sequelize.define<IStudioInstance, IStudioAttributes>("studios", attributes, options);

  Studio.associate = () => {
    Studio.hasMany(Database.Scene, { as: "scenes" });
    Studio.hasMany(Database.ScrapedItem, { as: "scraped_items" });
  };

  return Studio;
};
