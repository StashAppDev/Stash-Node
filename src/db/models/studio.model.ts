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

  getScraped_items: Sequelize.HasManyGetAssociationsMixin<IScrapedItemInstance>;
  setScraped_items: Sequelize.HasManySetAssociationsMixin<IScrapedItemInstance, IScrapedItemInstance["id"]>;
  addScraped_items: Sequelize.HasManyAddAssociationsMixin<IScrapedItemInstance, IScrapedItemInstance["id"]>;
  addScraped_item: Sequelize.HasManyAddAssociationMixin<IScrapedItemInstance, IScrapedItemInstance["id"]>;
  createScraped_item: Sequelize.HasManyCreateAssociationMixin<IScrapedItemAttributes, IScrapedItemInstance["id"]>;
  removeScraped_item: Sequelize.HasManyRemoveAssociationMixin<IScrapedItemInstance, IScrapedItemInstance["id"]>;
  removeScraped_items: Sequelize.HasManyRemoveAssociationsMixin<IScrapedItemInstance, IScrapedItemInstance["id"]>;
  hasScraped_item: Sequelize.HasManyHasAssociationMixin<IScrapedItemInstance, IScrapedItemInstance["id"]>;
  hasScraped_items: Sequelize.HasManyHasAssociationsMixin<IScrapedItemInstance, IScrapedItemInstance["id"]>;
  countScraped_items: Sequelize.HasManyCountAssociationsMixin;
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
