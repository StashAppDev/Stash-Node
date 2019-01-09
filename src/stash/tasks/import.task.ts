import Sequelize from "sequelize";
import { Database } from "../../db/database";
import { IGalleryAttributes } from "../../db/models/gallery.model";
import { IPerformerAttributes } from "../../db/models/performer.model";
import { ISceneMarkerAttributes, ISceneMarkerInstance } from "../../db/models/scene-markers.model";
import { ISceneAttributes, ISceneInstance } from "../../db/models/scene.model";
import { IScrapedItemAttributes, IScrapedItemInstance } from "../../db/models/scraped-item";
import { IStudioAttributes } from "../../db/models/studio.model";
import { ITagAttributes } from "../../db/models/tag.model";
import { IMappingJson, IScrapedJson, StashJson } from "../json.stash";
import { StashManager } from "../manager.stash";
import { BaseTask } from "./base.task";

export class ImportTask extends BaseTask {
  private mappings: IMappingJson;
  private scraped: IScrapedJson;

  constructor() {
    super();
    this.mappings = StashJson.getMappings();
    this.scraped = StashJson.getScraped();
  }

  public async start() {
    await this.importPerformers();
    await this.importStudios();
    await this.importGalleries();
    await this.importTags();

    // These run in their own transactions
    await this.importScrapedItems();
    await this.importScenes();
  }

  public async importPerformers() {
    const performers: IPerformerAttributes[] = [];
    for (const [i, mappingJson] of this.mappings.performers.entries()) {
      const index = i + 1;
      const performerJson = StashJson.getPerformer(mappingJson.checksum);
      if (!mappingJson.checksum || !mappingJson.name || !performerJson) { return; }

      StashManager.info(`Reading performer ${index} of ${this.mappings.performers.length}\r`);

      const performer: IPerformerAttributes = {
        image: Buffer.from(performerJson.image!, "base64"),
        checksum: mappingJson.checksum,
        name: mappingJson.name,
        url: performerJson.url,
        twitter: performerJson.twitter,
        instagram: performerJson.instagram,
        birthdate: performerJson.birthdate,
        ethnicity: performerJson.ethnicity,
        country: performerJson.country,
        eyeColor: performerJson.eye_color,
        height: performerJson.height,
        measurements: performerJson.measurements,
        fakeTits: performerJson.fake_tits,
        careerLength: performerJson.career_length,
        tattoos: performerJson.tattoos,
        piercings: performerJson.piercings,
        aliases: performerJson.aliases,
        favorite: performerJson.favorite,
      };

      performers.push(performer);
    }

    StashManager.info("Importing performers...");
    await this.bulkCreate(Database.Performer, performers);
    StashManager.info("Performer import complete");
  }

  private async importStudios() {
    const studios: IStudioAttributes[] = [];
    for (const [i, mappingJson] of this.mappings.studios.entries()) {
      const index = i + 1;
      const studioJson = StashJson.getStudio(mappingJson.checksum);
      if (!mappingJson.checksum || !mappingJson.name || !studioJson) { return; }

      StashManager.info(`Reading studio ${index} of ${this.mappings.studios.length}\r`);

      const studio: IStudioAttributes = {
        checksum: mappingJson.checksum,
        image: Buffer.from(studioJson.image, "base64"),
        name: mappingJson.name,
        url: studioJson.url,
      };

      studios.push(studio);
    }

    StashManager.info("Importing studios...");
    await this.bulkCreate(Database.Studio, studios);
    StashManager.info("Studio import complete");
  }

  private async importGalleries() {
    const galleries: IGalleryAttributes[] = [];
    for (const [i, mappingJson] of this.mappings.galleries.entries()) {
      const index = i + 1;
      if (!mappingJson.checksum || !mappingJson.path) { return; }

      StashManager.info(`Reading gallery ${index} of ${this.mappings.galleries.length}\r`);

      const gallery: IGalleryAttributes = {
        checksum: mappingJson.checksum,
        path: mappingJson.path,
      };

      galleries.push(gallery);
    }

    StashManager.info("Importing galleries...");
    await this.bulkCreate(Database.Gallery, galleries);
    StashManager.info("Gallery import complete");
  }

  private async importTags() {
    const tagNames: string[] = [];
    const tags: ITagAttributes[] = [];

    for (const [i, mappingJson] of this.mappings.scenes.entries()) {
      const index = i + 1;
      if (!mappingJson.checksum || !mappingJson.path) {
        StashManager.warn(`Scene mapping without checksum and path! ${mappingJson}`);
        return;
      }

      StashManager.info(`Reading tags for scene ${index} of ${this.mappings.scenes.length}\r`);

      // Return early if we are missing a json file.
      const sceneJson = StashJson.getScene(mappingJson.checksum);
      if (!sceneJson) { continue; }

      // Get the tags from the tags json if we have it
      if (!!sceneJson.tags) { tagNames.push(...sceneJson.tags); }

      // Get the tags from the markers if we have marker json
      if (!sceneJson.markers) { continue; }
      sceneJson.markers.forEach((markerJson) => {
        if (!!markerJson.primary_tag) { tagNames.push(markerJson.primary_tag); }
        if (!!markerJson.tags) { tagNames.push(...markerJson.tags); }
      });
    }

    const uniqueTagNames = [...new Set(tagNames)];
    uniqueTagNames.forEach((tagName) => {
      tags.push({ name: tagName });
    });

    StashManager.info("Importing tags...");
    await this.bulkCreate(Database.Tag, tags);
    StashManager.info("Tag import complete");
  }

  private async importScrapedItems() {
    const transaction = await Database.sequelize.transaction();

    try {
      for (const [i, mappingJson] of this.scraped.entries()) {
        const index = i + 1;
        StashManager.info(`Reading scraped site ${index} of ${this.scraped.length}\r`);

        const scrapedItemAttributes: IScrapedItemAttributes = {
          title: mappingJson.title,
          description: mappingJson.description,
          url: mappingJson.url,
          date: mappingJson.date,
          rating: mappingJson.rating,
          tags: mappingJson.tags,
          models: mappingJson.models,
          episode: mappingJson.episode,
          galleryFilename: mappingJson.gallery_filename,
          galleryUrl: mappingJson.gallery_url,
          videoFilename: mappingJson.video_filename,
          videoUrl: mappingJson.video_url,
        };

        let scrapedItem: IScrapedItemInstance;
        try {
          scrapedItem = await Database.ScrapedItem.create(scrapedItemAttributes, { transaction });
        } catch (e) {
          StashManager.error(`Failed to save scraped item <${scrapedItemAttributes.title}>`);
          throw e;
        }

        const studio = await this.getStudio(mappingJson.studio, transaction);
        await scrapedItem.setStudio(studio, { transaction });

        // Force update the timestamp
        const id = scrapedItem!.id!;
        const updatedAt = new Date(mappingJson.updated_at);
        await Database.ScrapedItem.update({ updatedAt }, { where: { id }, transaction, silent: true });
      }

      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
    }
  }

  private async importScenes() {
    const transaction = await Database.sequelize.transaction();

    try {
      for (const [i, mappingJson] of this.mappings.scenes.entries()) {
        const index = i + 1;
        if (!mappingJson.checksum || !mappingJson.path) {
          StashManager.warn(`Scene mapping without checksum and path! ${mappingJson}`);
          return;
        }

        StashManager.info(`Importing scene ${index} of ${this.mappings.scenes.length}\r`);

        const sceneAttributes: ISceneAttributes = { checksum: mappingJson.checksum, path: mappingJson.path };

        const sceneJson = StashJson.getScene(mappingJson.checksum);
        if (!!sceneJson) {
          sceneAttributes.title = sceneJson.title;
          sceneAttributes.details = sceneJson.details;
          sceneAttributes.url = sceneJson.url;
          sceneAttributes.date = sceneJson.date;
          sceneAttributes.rating = sceneJson.rating;

          if (!!sceneJson.file) {
            sceneAttributes.size = sceneJson.file.size;
            sceneAttributes.duration = sceneJson.file.duration;
            sceneAttributes.videoCodec = sceneJson.file.video_codec;
            sceneAttributes.audioCodec = sceneJson.file.audio_codec;
            sceneAttributes.width = sceneJson.file.width;
            sceneAttributes.height = sceneJson.file.height;
            sceneAttributes.framerate = sceneJson.file.framerate;
            sceneAttributes.bitrate = sceneJson.file.bitrate;
          } else {
            // TODO: Get FFMPEG metadata?
          }
        }

        let scene: ISceneInstance;
        try {
          scene = await Database.Scene.create(sceneAttributes, { transaction });
        } catch (e) {
          StashManager.error(`Failed to save scene <${sceneAttributes.path}>`);
          throw e;
        }

        if (!!sceneJson.studio) {
          const studio = await this.getStudio(sceneJson.studio, transaction);
          await scene.setStudio(studio, { transaction });
        }
        if (!!sceneJson.gallery) {
          const gallery = await this.getGallery(sceneJson.gallery, transaction);
          await scene.setGallery(gallery, { transaction });
        }
        if (!!sceneJson.performers) {
          const performers = await this.getPerformers(sceneJson.performers, transaction);
          await scene.setPerformers(performers, { transaction });
        }
        if (!!sceneJson.tags) {
          const tags = await this.getTags(sceneJson.tags, transaction);
          await scene.setTags(tags, { transaction });
        }
        if (!!sceneJson.markers) {
          const sceneMarkers: ISceneMarkerInstance[] = [];
          for (const markerJson of sceneJson.markers) {
            const markerAttributes: ISceneMarkerAttributes = {
              title: markerJson.title,
              seconds: markerJson.seconds,
            };

            const marker = await Database.SceneMarker.create(markerAttributes, { transaction });

            const primaryTag = await this.getTag(markerJson.primary_tag, transaction);
            if (!!primaryTag) { await marker.setPrimary_tag(primaryTag, { transaction }); }

            const markerTags = await this.getTags(markerJson.tags, transaction);
            if (!!markerTags) { await marker.setTags(markerTags, { transaction }); }

            sceneMarkers.push(marker);
          }

          try {
            await scene.setScene_markers(sceneMarkers, { transaction });
          } catch (e) {
            StashManager.error(`Failed to save scene <${sceneAttributes.path}> due to invalid scene markers`);
            throw e;
          }
        }
      }
      await transaction.commit();
    } catch (e) {
      StashManager.error(`Failed to save scenes!  Error: ${e}`);
      transaction.rollback();
    }
  }

  private async bulkCreate<TInstance, TAttributes>(
    model: Sequelize.Model<TInstance, TAttributes>,
    records: TAttributes[],
  ) {
    const transaction = await Database.sequelize.transaction();
    try {
      await model.bulkCreate(records, { transaction });
      await transaction.commit();
    } catch (e) {
      transaction.rollback();
      StashManager.error(`Import of ${model.name} failed.`);
      if (!!e.original) { StashManager.error(e.original); }
    }
  }

  private async getStudio(studioName: string, transaction?: Sequelize.Transaction) {
    if (studioName.length === 0) { return; }

    const studio = await Database.Studio.findOne({ where: { name: studioName }, transaction });
    if (!!studio) {
      return studio;
    } else {
      StashManager.warn(`Studio <${studioName}> does not exist!`);
      return;
    }
  }

  private async getGallery(checksum: string, transaction?: Sequelize.Transaction) {
    if (checksum.length === 0) { return; }

    const gallery = await Database.Gallery.findOne({ where: { checksum }, transaction });
    if (!!gallery) {
      return gallery;
    } else {
      StashManager.warn(`Gallery <${checksum}> does not exist!`);
      return;
    }
  }

  private async getPerformers(performerNames: string[], transaction?: Sequelize.Transaction) {
    if (performerNames.length === 0) { return; }

    const performers = await Database.Performer.findAll({ where: { name: performerNames }, transaction });

    const pluckedNames = performers.map((p) => p.name).filter((p) => p !== undefined) as string[];
    const missingPerformers = performerNames.filter((item) => pluckedNames.indexOf(item) < 0); // TODO test
    missingPerformers.forEach((name) => StashManager.warn(`Performer <${name}> does not exist!`));

    return performers;
  }

  private async getTags(tagNames: string[], transaction?: Sequelize.Transaction) {
    if (tagNames.length === 0) { return; }

    const tags = await Database.Tag.findAll({ where: { name: tagNames }, transaction });

    const pluckedNames = tags.map((t) => t.name).filter((t) => t !== undefined) as string[];
    const missingTags = tagNames.filter((item) => pluckedNames.indexOf(item) < 0); // TODO test
    missingTags.forEach((name) => StashManager.warn(`Tag <${name}> does not exist!`));

    return tags;
  }

  private async getTag(tagName: string, transaction?: Sequelize.Transaction) {
    if (tagName.length === 0) { return; }

    const tag = await Database.Tag.findOne({ where: { name: tagName }, transaction });
    if (!!tag) {
      return tag;
    } else {
      StashManager.warn(`Tag <${tagName}> does not exist!`);
      return;
    }
  }
}
