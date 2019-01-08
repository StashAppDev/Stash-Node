import Sequelize from "sequelize";
import { Database } from "../../db/database";
import { IGalleryAttributes } from "../../db/models/gallery.model";
import { IPerformerAttributes } from "../../db/models/performer.model";
import { IStudioAttributes } from "../../db/models/studio.model";
import { IMappingJson, StashJson } from "../json.stash";
import { StashManager } from "../manager.stash";
import { BaseTask } from "./base.task";

export class ImportTask extends BaseTask {
  private mappings: IMappingJson;

  constructor() {
    super();
    this.mappings = StashJson.getMappings();
  }

  public async start() {
    await this.importPerformers();
    await this.importStudios();
    await this.importGalleries();
    // import_tags

    // ScrapedItem.transaction {
    //   import_scraped_sites
    // }

    // Scene.transaction {
    //   import_scenes
    // }
  }

  public async importPerformers() {
    const performerMappings = this.mappings.performers;
    if (!performerMappings) { return; }

    const performers: IPerformerAttributes[] = [];
    performerMappings.forEach((performerMappingJson, i) => {
      const index = i + 1;
      const performerJson = StashJson.getPerformer(performerMappingJson.checksum);
      if (!performerMappingJson.checksum || !performerMappingJson.name || !performerJson) { return; }

      StashManager.info(`Reading performer ${index} of ${performerMappings.length}\r`);

      const performer: IPerformerAttributes = {
        image: Buffer.from(performerJson.image!, "base64"),
        checksum: performerMappingJson.checksum,
        name: performerMappingJson.name,
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
    });

    StashManager.info("Importing performers...");
    await this.bulkCreate(Database.Performer, performers);
    StashManager.info("Performer import complete");
  }

  private async importStudios() {
    const studioMappings = this.mappings.studios;
    if (!studioMappings) { return; }

    const studios: IStudioAttributes[] = [];
    studioMappings.forEach((studioMappingJson, i) => {
      const index = i + 1;
      const studioJson = StashJson.getStudio(studioMappingJson.checksum);
      if (!studioMappingJson.checksum || !studioMappingJson.name || !studioJson) { return; }

      StashManager.info(`Reading studio ${index} of ${studioMappings.length}\r`);

      const studio: IStudioAttributes = {
        checksum: studioMappingJson.checksum,
        image: Buffer.from(studioJson.image, "base64"),
        name: studioMappingJson.name,
        url: studioJson.url,
      };

      studios.push(studio);
    });

    StashManager.info("Importing studios...");
    await this.bulkCreate(Database.Studio, studios);
    StashManager.info("Studio import complete");
  }

  private async importGalleries() {
    const mappings = this.mappings.galleries;
    if (!mappings) { return; }

    const galleries: IGalleryAttributes[] = [];
    mappings.forEach((mappingJson, i) => {
      const index = i + 1;
      if (!mappingJson.checksum || !mappingJson.path) { return; }

      StashManager.info(`Reading gallery ${index} of ${mappings.length}\r`);

      const gallery: IGalleryAttributes = {
        checksum: mappingJson.checksum,
        path: mappingJson.path,
      };

      galleries.push(gallery);
    });

    StashManager.info("Importing galleries...");
    await this.bulkCreate(Database.Gallery, galleries);
    StashManager.info("Gallery import complete");
  }

  // private async importTags() {

  // }

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
      throw Error(`Import of ${model.name} failed.`);
    }
  }
}
