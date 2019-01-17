import { transaction, Transaction } from "objection";
import { Database } from "../../db/database";
import { Gallery } from "../../db/models/gallery.model";
import { Performer } from "../../db/models/performer.model";
import { SceneMarker } from "../../db/models/scene-marker.model";
import { Scene } from "../../db/models/scene.model";
import { ScrapedItem } from "../../db/models/scraped-item.model";
import { Studio } from "../../db/models/studio.model";
import { Tag } from "../../db/models/tag.model";
import { IMappingJson, IScrapedJson, StashJson } from "../json.stash";
import { StashManager } from "../manager.stash";
import { BaseTask } from "./base.task";

export class ImportTask extends BaseTask {
  private mappings: IMappingJson;
  private scraped: IScrapedJson;

  constructor() {
    super();
  }

  public async start() {
    this.mappings = await StashJson.getMappings();
    this.scraped = await StashJson.getScraped();

    await this.importPerformers();
    await this.importStudios();
    await this.importGalleries();
    await this.importTags();

    // These run in their own transactions
    await this.importScrapedItems();
    await this.importScenes();
  }

  public async importPerformers() {
    const performers: Array<Partial<Performer>> = [];
    for (const [i, mappingJson] of this.mappings.performers.entries()) {
      const index = i + 1;
      const performerJson = await StashJson.getPerformer(mappingJson.checksum);
      if (!mappingJson.checksum || !mappingJson.name || !performerJson) { return; }

      StashManager.info(`Reading performer ${index} of ${this.mappings.performers.length}\r`);

      const dateString = this.getDateString();
      const performer: Partial<Performer> = {
        image: Buffer.from(performerJson.image!, "base64"),
        checksum: mappingJson.checksum,
        name: mappingJson.name,
        url: performerJson.url,
        twitter: performerJson.twitter,
        instagram: performerJson.instagram,
        birthdate: performerJson.birthdate,
        ethnicity: performerJson.ethnicity,
        country: performerJson.country,
        eye_color: performerJson.eye_color,
        height: performerJson.height,
        measurements: performerJson.measurements,
        fake_tits: performerJson.fake_tits,
        career_length: performerJson.career_length,
        tattoos: performerJson.tattoos,
        piercings: performerJson.piercings,
        aliases: performerJson.aliases,
        favorite: performerJson.favorite,

        created_at: dateString,
        updated_at: dateString,
      };

      performers.push(performer);
    }

    StashManager.info("Importing performers...");
    await this.bulkCreate(Performer, performers);
    StashManager.info("Performer import complete");
  }

  private async importStudios() {
    const studios: Array<Partial<Studio>> = [];
    for (const [i, mappingJson] of this.mappings.studios.entries()) {
      const index = i + 1;
      const studioJson = await StashJson.getStudio(mappingJson.checksum);
      if (!mappingJson.checksum || !mappingJson.name || !studioJson) { return; }

      StashManager.info(`Reading studio ${index} of ${this.mappings.studios.length}\r`);

      const dateString = this.getDateString();
      const studio: Partial<Studio> = {
        checksum: mappingJson.checksum,
        image: Buffer.from(studioJson.image, "base64"),
        name: mappingJson.name,
        url: studioJson.url,

        created_at: dateString,
        updated_at: dateString,
      };

      studios.push(studio);
    }

    StashManager.info("Importing studios...");
    await this.bulkCreate(Studio, studios);
    StashManager.info("Studio import complete");
  }

  private async importGalleries() {
    const galleries: Array<Partial<Gallery>> = [];
    for (const [i, mappingJson] of this.mappings.galleries.entries()) {
      const index = i + 1;
      if (!mappingJson.checksum || !mappingJson.path) { return; }

      StashManager.info(`Reading gallery ${index} of ${this.mappings.galleries.length}\r`);

      const dateString = this.getDateString();
      const gallery: Partial<Gallery> = {
        checksum: mappingJson.checksum,
        path: mappingJson.path,

        created_at: dateString,
        updated_at: dateString,
      };

      galleries.push(gallery);
    }

    StashManager.info("Importing galleries...");
    await this.bulkCreate(Gallery, galleries);
    StashManager.info("Gallery import complete");
  }

  private async importTags() {
    const tagNames: string[] = [];
    const tags: Array<Partial<Tag>> = [];

    for (const [i, mappingJson] of this.mappings.scenes.entries()) {
      const index = i + 1;
      if (!mappingJson.checksum || !mappingJson.path) {
        StashManager.warn(`Scene mapping without checksum and path! ${mappingJson}`);
        return;
      }

      StashManager.info(`Reading tags for scene ${index} of ${this.mappings.scenes.length}\r`);

      // Return early if we are missing a json file.
      const sceneJson = await StashJson.getScene(mappingJson.checksum);
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

    const dateString = this.getDateString();
    const uniqueTagNames = [...new Set(tagNames)];
    uniqueTagNames.forEach((tagName) => {
      tags.push({ name: tagName, created_at: dateString, updated_at: dateString });
    });

    StashManager.info("Importing tags...");
    await this.bulkCreate(Tag, tags);
    StashManager.info("Tag import complete");
  }

  private async importScrapedItems() {
    const dateString = this.getDateString();
    const trx = await transaction.start(Database.knex);
    try {
      StashManager.info("Importing scraped sites...");
      for (const [i, mappingJson] of this.scraped.entries()) {
        const index = i + 1;
        StashManager.info(`Reading scraped site ${index} of ${this.scraped.length}\r`);

        const scrapedItemAttributes: Partial<ScrapedItem> = {
          title: mappingJson.title,
          description: mappingJson.description,
          url: mappingJson.url,
          date: mappingJson.date,
          rating: mappingJson.rating,
          tags: mappingJson.tags,
          models: mappingJson.models,
          episode: mappingJson.episode,
          gallery_filename: mappingJson.gallery_filename,
          gallery_url: mappingJson.gallery_url,
          video_filename: mappingJson.video_filename,
          video_url: mappingJson.video_url,

          created_at: dateString,
          updated_at: new Date(mappingJson.updated_at).toISOString(), // TODO
        };

        const studio = await this.getStudio(mappingJson.studio, trx);
        if (!!studio) {
          scrapedItemAttributes.studio_id = studio.id;
        }

        try {
          await ScrapedItem.query(trx).context({ silent: true }).insert(scrapedItemAttributes);
        } catch (e) {
          StashManager.error(`Failed to save scraped item <${scrapedItemAttributes.title}>`);
          throw e;
        }
      }

      await trx.commit();
      StashManager.info("Scraped site import complete");
    } catch (e) {
      await trx.rollback();
    }
  }

  private async importScenes() {
    const trx = await transaction.start(Database.knex);
    try {
      for (const [i, mappingJson] of this.mappings.scenes.entries()) {
        const index = i + 1;
        if (!mappingJson.checksum || !mappingJson.path) {
          StashManager.warn(`Scene mapping without checksum and path! ${mappingJson}`);
          return;
        }

        if (i === 0 || index % 50 === 0) {
          StashManager.info(`Importing scene ${index} of ${this.mappings.scenes.length}\r`);
        }

        const sceneAttributes: Partial<Scene> = { checksum: mappingJson.checksum, path: mappingJson.path };

        const sceneJson = await StashJson.getScene(mappingJson.checksum);
        if (!!sceneJson) {
          sceneAttributes.title = sceneJson.title;
          sceneAttributes.details = sceneJson.details;
          sceneAttributes.url = sceneJson.url;
          sceneAttributes.date = sceneJson.date;
          sceneAttributes.rating = sceneJson.rating;

          if (!!sceneJson.file) {
            sceneAttributes.size = sceneJson.file.size;
            sceneAttributes.duration = sceneJson.file.duration;
            sceneAttributes.video_codec = sceneJson.file.video_codec;
            sceneAttributes.audio_codec = sceneJson.file.audio_codec;
            sceneAttributes.width = sceneJson.file.width;
            sceneAttributes.height = sceneJson.file.height;
            sceneAttributes.framerate = sceneJson.file.framerate;
            sceneAttributes.bitrate = sceneJson.file.bitrate;
          } else {
            // TODO: Get FFMPEG metadata?
          }
        }

        if (!!sceneJson.studio) {
          const studio = await this.getStudio(sceneJson.studio, trx);
          if (!!studio) { sceneAttributes.studio_id = studio.id; }
        }

        let scene: Scene;
        try {
          scene = await Scene.query(trx).insertAndFetch(sceneAttributes);
        } catch (e) {
          StashManager.error(`Failed to save scene <${sceneAttributes.path}>`);
          throw e;
        }

        if (!!sceneJson.gallery) {
          const gallery = await this.getGallery(sceneJson.gallery, trx);
          if (!!gallery) { await scene.$relatedQuery("gallery", trx).relate(gallery.id); }
        }
        if (!!sceneJson.performers) {
          const performers = await this.getPerformers(sceneJson.performers, trx);
          if (!!performers) {
            for (const performer of performers) {
              await scene.$relatedQuery("performers", trx).relate(performer.id!);
            }
          }
        }
        if (!!sceneJson.tags) {
          const tags = await this.getTags(sceneJson.tags, trx);
          if (!!tags) {
            for (const tag of tags) {
              await scene.$relatedQuery("tags", trx).relate(tag.id!);
            }
          }
        }
        if (!!sceneJson.markers) {
          const sceneMarkers: SceneMarker[] = [];
          for (const markerJson of sceneJson.markers) {
            const markerAttributes: Partial<SceneMarker> = {
              title: markerJson.title,
              seconds: markerJson.seconds,
            };

            const marker = await SceneMarker.query(trx).insertAndFetch(markerAttributes);

            const primaryTag = await this.getTag(markerJson.primary_tag, trx);
            if (!!primaryTag) { await marker.$query(trx).update({ primary_tag_id: primaryTag.id }); }

            const markerTags = await this.getTags(markerJson.tags, trx);
            if (!!markerTags) {
              for (const markerTag of markerTags) {
                await marker.$relatedQuery("tags", trx).relate(markerTag.id!);
              }
            }

            sceneMarkers.push(marker);
          }

          try {
            for (const sceneMarker of sceneMarkers) {
              await scene.$relatedQuery("scene_markers", trx).relate(sceneMarker.id!);
            }
          } catch (e) {
            StashManager.error(`Failed to save scene <${sceneAttributes.path}> due to invalid scene markers`);
            throw e;
          }
        }
      }
      await trx.commit();
    } catch (e) {
      StashManager.error(`Failed to save scenes!  Error: ${e}`);
      trx.rollback();
    }
  }

  private async bulkCreate<T>(type: new() => T, records: T[]) {
    try {
      const tableName = (type as any).tableName;
      await Database.knex.batchInsert(tableName, records, 20);
    } catch (e) {
      StashManager.error(`Import of ${type.name} failed.`);
      if (!!e.stack) { StashManager.error(e.stack); }
    }
  }

  private async getStudio(studioName: string, trx: Transaction) {
    if (studioName.length === 0) { return; }

    const studio = await Studio.query(trx).findOne({ name: studioName });
    if (!!studio) {
      return studio;
    } else {
      StashManager.warn(`Studio <${studioName}> does not exist!`);
      return;
    }
  }

  private async getGallery(checksum: string, trx: Transaction) {
    if (checksum.length === 0) { return; }

    const gallery = await Gallery.query(trx).findOne({ checksum });
    if (!!gallery) {
      return gallery;
    } else {
      StashManager.warn(`Gallery <${checksum}> does not exist!`);
      return;
    }
  }

  private async getPerformers(performerNames: string[], trx: Transaction) {
    if (performerNames.length === 0) { return; }

    const performers = await Performer.query(trx).whereIn("name", performerNames);

    const pluckedNames = performers.map((p) => p.name).filter((p) => p !== undefined) as string[];
    const missingPerformers = performerNames.filter((item) => pluckedNames.indexOf(item) < 0); // TODO test
    missingPerformers.forEach((name) => StashManager.warn(`Performer <${name}> does not exist!`));

    return performers;
  }

  private async getTags(tagNames: string[], trx: Transaction) {
    if (tagNames.length === 0) { return; }

    const tags = await Tag.query(trx).whereIn("name", tagNames);

    const pluckedNames = tags.map((t) => t.name).filter((t) => t !== undefined) as string[];
    const missingTags = tagNames.filter((item) => pluckedNames.indexOf(item) < 0); // TODO test
    missingTags.forEach((name) => StashManager.warn(`Tag <${name}> does not exist!`));

    return tags;
  }

  private async getTag(tagName: string, trx: Transaction) {
    if (tagName.length === 0) { return; }

    const tag = await Tag.query(trx).findOne({ name: tagName });
    if (!!tag) {
      return tag;
    } else {
      StashManager.warn(`Tag <${tagName}> does not exist!`);
      return;
    }
  }

  private getDateString() {
    return new Date().toISOString();
  }
}
