// tslint:disable:object-literal-sort-keys
import * as Sequelize from "sequelize";
import { SequelizeAttributes } from "../../typings/sequelize-attributes";
import { IStudioAttributes, IStudioInstance } from "./studio.model";
import { ITagAttributes, ITagInstance } from "./tag.model";

export interface ISceneAttributes {
  id?: number;
  checksum?: string;
  title?: string;
  details?: string;
  url?: string;
  date?: string;
  rating?: number;
  path?: string;
  size?: string;
  duration?: number;
  videoCodec?: string;
  audioCodec?: string;
  width?: number;
  height?: number;
  createdAt?: Date;
  updatedAt?: Date;
  studio?: IStudioAttributes | IStudioAttributes["id"];
  tags?: ITagAttributes[] | Array<ITagAttributes["id"]>;
}

export interface ISceneInstance extends Sequelize.Instance<ISceneAttributes>, ISceneAttributes {
  getStudio: Sequelize.BelongsToGetAssociationMixin<IStudioInstance>;
  setStudio: Sequelize.BelongsToSetAssociationMixin<IStudioInstance, IStudioInstance["id"]>;
  createStudio: Sequelize.BelongsToCreateAssociationMixin<IStudioAttributes, IStudioInstance>;

  getTags: Sequelize.BelongsToManyGetAssociationsMixin<ITagInstance>;
  setTags: Sequelize.BelongsToManySetAssociationsMixin<ITagInstance, ITagInstance["id"], "scene_tags">;
  addTags: Sequelize.BelongsToManyAddAssociationsMixin<ITagInstance, ITagInstance["id"], "scene_tags">;
  addTag: Sequelize.BelongsToManyAddAssociationMixin<ITagInstance, ITagInstance["id"], "scene_tags">;
  createTags: Sequelize.BelongsToManyCreateAssociationMixin<ITagInstance, ITagInstance["id"], "scene_tags">;
  removeTag: Sequelize.BelongsToManyRemoveAssociationMixin<ITagInstance, ITagInstance["id"]>;
  removeTags: Sequelize.BelongsToManyRemoveAssociationsMixin<ITagInstance, ITagInstance["id"]>;
  hasTag: Sequelize.BelongsToManyHasAssociationMixin<ITagInstance, ITagInstance["id"]>;
  hasTags: Sequelize.BelongsToManyHasAssociationsMixin<ITagInstance, ITagInstance["id"]>;
  countTags: Sequelize.BelongsToManyCountAssociationsMixin;
}

export const SceneFactory = (
  sequelize: Sequelize.Sequelize,
  DataTypes: Sequelize.DataTypes,
): Sequelize.Model<ISceneInstance, ISceneAttributes> => {
  const attributes: SequelizeAttributes<ISceneAttributes> = {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    checksum: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
    title: { type: DataTypes.STRING },
    details: { type: DataTypes.TEXT },
    url: { type: DataTypes.STRING },
    date: { type: DataTypes.STRING }, // TODO: date?
    rating: { type: DataTypes.TINYINT },
    path: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
    size: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    duration: {
      allowNull: false,
      type: DataTypes.DECIMAL({ precision: 7, scale: 2 }),
    },
    videoCodec: {
      allowNull: false,
      field: "video_codec",
      type: DataTypes.STRING,
    },
    audioCodec: {
      allowNull: false,
      field: "audio_codec",
      type: DataTypes.STRING,
    },
    width: {
      allowNull: false,
      type: DataTypes.TINYINT,
    },
    height: {
      allowNull: false,
      type: DataTypes.TINYINT,
    },
  };

  const Scene = sequelize.define<ISceneInstance, ISceneAttributes>("scenes", attributes);

  Scene.associate = (models) => {
    Scene.belongsTo(models.studios, { as: "studio", foreignKey: "studio_id" });
    Scene.belongsToMany(models.tags, { as: "tags", through: "scene_tags", foreignKey: "scene_id" });
  };

  return Scene;
};

// export const addScopes = (model: Sequelize.Model<ISceneInstance, ISceneAttributes>) => {
//   const fullScope: Sequelize.AnyFindOptions = {
//     include: [{ model: Studio, as: "studio" }],
//   };
//   model.addScope("defaultScope", fullScope);
// };
