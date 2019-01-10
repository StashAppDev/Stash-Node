import * as Sequelize from "sequelize";
import { Database } from "../database";
import { IStudioAttributes, IStudioInstance } from "./studio.model";

export interface IScrapedItemAttributes {
  id?: number;
  title?: string;
  description?: string;
  url?: string;
  date?: string; // TODO: date?
  rating?: string;
  tags?: string;
  models?: string;
  episode?: number;
  galleryFilename?: string;
  galleryUrl?: string;
  videoFilename?: string;
  videoUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
  studio?: IStudioAttributes | IStudioAttributes["id"];
}

export interface IScrapedItemInstance extends Sequelize.Instance<IScrapedItemAttributes>, IScrapedItemAttributes {
  getStudio: Sequelize.BelongsToGetAssociationMixin<IStudioInstance>;
  setStudio: Sequelize.BelongsToSetAssociationMixin<IStudioInstance, IStudioInstance["id"]>;
  createStudio: Sequelize.BelongsToCreateAssociationMixin<IStudioAttributes, IStudioInstance>;
}

export const ScrapedItemFactory = (
  sequelize: Sequelize.Sequelize,
  DataTypes: Sequelize.DataTypes,
): Sequelize.Model<IScrapedItemInstance, IScrapedItemAttributes> => {
  // tslint:disable:object-literal-sort-keys
  const attributes: Sequelize.DefineModelAttributes<IScrapedItemAttributes> = {
    id:               { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    title:            { type: DataTypes.STRING },
    description:      { type: DataTypes.STRING },
    url:              { type: DataTypes.STRING },
    date:             { type: DataTypes.STRING }, // TODO: date?
    rating:           { type: DataTypes.STRING },
    tags:             { type: DataTypes.STRING },
    models:           { type: DataTypes.STRING },
    episode:          { type: DataTypes.INTEGER },
    galleryFilename:  { type: DataTypes.STRING },
    galleryUrl:       { type: DataTypes.STRING },
    videoFilename:    { type: DataTypes.STRING },
    videoUrl:         { type: DataTypes.STRING },
  };
  // tslint:enable:object-literal-sort-keys

  const options: Sequelize.DefineOptions<IScrapedItemInstance> = {
    indexes: [
      { name: "index_scraped_items_on_studio_id", fields: ["studio_id"] },
    ],
  };

  const ScrapedItem = sequelize.define<IScrapedItemInstance, IScrapedItemAttributes>(
    "scraped_items", attributes, options,
  );

  ScrapedItem.associate = () => {
    ScrapedItem.belongsTo(Database.Studio, { as: "studio", foreignKey: "studio_id" });
  };

  return ScrapedItem;
};
