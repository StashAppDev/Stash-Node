import * as Sequelize from "sequelize";
import { Database } from "../database";
import { ISceneAttributes, ISceneInstance } from "./scene.model";

export interface IPerformerAttributes {
  id?: number;
  image?: Buffer;
  checksum?: string;
  name?: string;
  url?: string;
  twitter?: string;
  instagram?: string;
  birthdate?: string; // TODO dates?
  ethnicity?: string;
  country?: string;
  eyeColor?: string;
  height?: string;
  measurements?: string;
  fakeTits?: string;
  careerLength?: string;
  tattoos?: string;
  piercings?: string;
  aliases?: string;
  favorite?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  scene?: ISceneAttributes | ISceneAttributes["id"];
}

export interface IPerformerInstance extends Sequelize.Instance<IPerformerAttributes>, IPerformerAttributes {
  getScenes: Sequelize.BelongsToManyGetAssociationsMixin<ISceneInstance>;
  setScenes: Sequelize.BelongsToManySetAssociationsMixin<ISceneInstance, ISceneInstance["id"], "performers_scenes">;
  addScenes: Sequelize.BelongsToManyAddAssociationsMixin<ISceneInstance, ISceneInstance["id"], "performers_scenes">;
  addScene: Sequelize.BelongsToManyAddAssociationMixin<ISceneInstance, ISceneInstance["id"], "performers_scenes">;
  createScenes:
    Sequelize.BelongsToManyCreateAssociationMixin<ISceneAttributes, ISceneInstance["id"], "performers_scenes">;
  removeScene: Sequelize.BelongsToManyRemoveAssociationMixin<ISceneInstance, ISceneInstance["id"]>;
  removeScenes: Sequelize.BelongsToManyRemoveAssociationsMixin<ISceneInstance, ISceneInstance["id"]>;
  hasScene: Sequelize.BelongsToManyHasAssociationMixin<ISceneInstance, ISceneInstance["id"]>;
  hasScenes: Sequelize.BelongsToManyHasAssociationsMixin<ISceneInstance, ISceneInstance["id"]>;
  countScenes: Sequelize.BelongsToManyCountAssociationsMixin;
}

export const PerformerFactory = (
  sequelize: Sequelize.Sequelize,
  DataTypes: Sequelize.DataTypes,
): Sequelize.Model<IPerformerInstance, IPerformerAttributes> => {
  // tslint:disable:object-literal-sort-keys
  const attributes: Sequelize.DefineModelAttributes<IPerformerAttributes> = {
    id:           { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    image:        { type: DataTypes.BLOB },
    checksum:     { type: DataTypes.STRING, allowNull: false, unique: true },
    name:         { type: DataTypes.STRING },
    url:          { type: DataTypes.STRING },
    twitter:      { type: DataTypes.STRING },
    instagram:    { type: DataTypes.STRING },
    birthdate:    { type: DataTypes.STRING }, // TODO dates?
    ethnicity:    { type: DataTypes.STRING },
    country:      { type: DataTypes.STRING },
    eyeColor:     { type: DataTypes.STRING, field: "eye_color" },
    height:       { type: DataTypes.STRING },
    measurements: { type: DataTypes.STRING },
    fakeTits:     { type: DataTypes.STRING, field: "fake_tits" },
    careerLength: { type: DataTypes.STRING, field: "career_length" },
    tattoos:      { type: DataTypes.STRING },
    piercings:    { type: DataTypes.STRING },
    aliases:      { type: DataTypes.STRING },
    favorite:     { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  };
  // tslint:enable:object-literal-sort-keys

  const options: Sequelize.DefineOptions<IPerformerInstance> = {
    indexes: [
      { name: "index_performers_on_checksum", fields: ["checksum"] },
      { name: "index_performers_on_name", fields: ["name"] },
    ],
  };

  const Performer = sequelize.define<IPerformerInstance, IPerformerAttributes>("performers", attributes, options);

  Performer.associate = () => {
    Performer.belongsToMany(Database.Scene, { as: "scene", through: "performers_scenes", foreignKey: "performer_id" });
  };

  return Performer;
};
