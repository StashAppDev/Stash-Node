import { Gallery } from "../../db/models/gallery.model";
import { Performer } from "../../db/models/performer.model";
import { Scene } from "../../db/models/scene.model";
import { ScrapedItem } from "../../db/models/scraped-item.model";
import { Studio } from "../../db/models/studio.model";
import { log } from "../../logger";
import { ImageUtils } from "../../utils/image.utils";
import {
  IMappingJson,
  IPerformerJson,
  ISceneJson,
  ISceneMarkerJson,
  IScrapedItemJson,
  IStudioJson,
  StashJson,
} from "../json.stash";
import { BaseTask } from "./base.task";

export class ExportTask extends BaseTask {
  private mappings: IMappingJson = { performers: [], studios: [], galleries: [], scenes: []};

  constructor() {
    super();
  }

  public async start() {
    // @manager.total = Scene.count + Gallery.count + Performer.count + Studio.count

    await this.exportScenes();
    await this.exportGalleries();
    await this.exportPerformers();
    await this.exportStudios();

    await StashJson.saveMappings(this.mappings);

    await this.exportScraped();
  }

  private async exportScenes() {
    const scenes = await Scene.query();
    log.info(`Exporting ${scenes.length} scenes...`);
    for (const scene of scenes) {
      await scene.$relatedQuery("studio");
      await scene.$relatedQuery("gallery");
      await scene.$relatedQuery("performers");
      await scene.$relatedQuery("tags");
      await scene.$relatedQuery("scene_markers");

      this.mappings.scenes.push({ path: scene.path!, checksum: scene.checksum! });

      const json: ISceneJson = {};
      if (!!scene.title || scene.title === "") { json.title = scene.title; }
      if (!!scene.studio && !!scene.studio.name) { json.studio = scene.studio.name; }
      if (!!scene.url || scene.url === "") { json.url = scene.url; }
      if (!!scene.date) { json.date = scene.date.toString(); }
      if (!!scene.rating) { json.rating = scene.rating; }
      if (!!scene.details || scene.details === "") { json.details = scene.details; }
      if (!!scene.gallery) { json.gallery = scene.gallery.checksum; }

      const performerNames = this.getNames(scene.performers || []);
      if (performerNames.length > 0) { json.performers = performerNames; }

      const tagNames = this.getNames(scene.tags || []);
      if (tagNames.length > 0) { json.tags = tagNames; }

      if (!!scene.scene_markers && scene.scene_markers.length > 0) {
        json.markers = [];
        for (const marker of scene.scene_markers) {
          await marker.$relatedQuery("primary_tag");
          await marker.$relatedQuery("tags").modify("orderedByName");
          if (!marker.title || !marker.seconds || !marker.primary_tag || !marker.primary_tag.name ) {
            throw new Error("Invalid scene marker");
          }
          const markerJson: ISceneMarkerJson = {
            title: marker.title,
            seconds: this.getDecimalString(marker.seconds),
            primary_tag: marker.primary_tag.name,
            tags: this.getNames(marker.tags || []),
          };
          json.markers.push(markerJson);
        }
      } else if (scene.scene_markers !== undefined) {
        delete json.markers;
      }

      json.file              = {};
      json.file.size        = scene.size;
      json.file.duration    = this.getDecimalString(scene.duration);
      json.file.video_codec = scene.video_codec;
      json.file.audio_codec = scene.audio_codec;
      json.file.width       = scene.width;
      json.file.height      = scene.height;
      json.file.framerate   = this.getDecimalString(scene.framerate);
      json.file.bitrate     = scene.bitrate;

      const sceneJson = await StashJson.getScene(scene.checksum!);
      if (JSON.stringify(sceneJson) === JSON.stringify(json)) { continue; }

      await StashJson.saveScene(scene.checksum!, json);
    }

    log.info(`Exporting scenes complete`);
  }

  private async exportGalleries() {
    const galleries = await Gallery.query();
    log.info(`Exporting ${galleries.length} galleries...`);
    for (const gallery of galleries) {
      this.mappings.galleries.push({ path: gallery.path!, checksum: gallery.checksum! });
    }

    log.info(`Exporting galleries complete`);
  }

  private async exportPerformers() {
    const performers = await Performer.query();
    log.info(`Exporting ${performers.length} performers...`);
    for (const performer of performers) {
      this.mappings.performers.push({ name: performer.name!, checksum: performer.checksum! });

      const json: Partial<IPerformerJson> = {};
      if (!!performer.name || performer.name === "") { json.name = performer.name; }
      if (!!performer.url || performer.url === "") { json.url = performer.url; }
      if (!!performer.twitter || performer.twitter === "") { json.twitter = performer.twitter; }
      if (!!performer.instagram || performer.instagram === "") { json.instagram = performer.instagram; }
      if (!!performer.birthdate || performer.birthdate === "") { json.birthdate = performer.birthdate; }
      if (!!performer.ethnicity || performer.ethnicity === "") { json.ethnicity = performer.ethnicity; }
      if (!!performer.country || performer.country === "") { json.country = performer.country; }
      if (!!performer.eye_color || performer.eye_color === "") { json.eye_color = performer.eye_color; }
      if (!!performer.height || performer.height === "") { json.height = performer.height; }
      if (!!performer.measurements || performer.measurements === "") { json.measurements = performer.measurements; }
      if (!!performer.fake_tits || performer.fake_tits === "") { json.fake_tits = performer.fake_tits; }
      if (!!performer.career_length || performer.career_length === "") { json.career_length = performer.career_length; }
      if (!!performer.tattoos || performer.tattoos === "") { json.tattoos = performer.tattoos; }
      if (!!performer.piercings || performer.piercings === "") { json.piercings = performer.piercings; }
      if (!!performer.aliases || performer.aliases === "") { json.aliases = performer.aliases; }
      json.favorite = performer.favorite || false;
      json.image = ImageUtils.encodeBase64Image(performer);

      const performerJson = await StashJson.getPerformer(performer.checksum!);
      if (JSON.stringify(performerJson) === JSON.stringify(json)) { continue; }

      await StashJson.savePerformer(performer.checksum!, json as any);
    }

    log.info(`Exporting performers complete`);
  }

  private async exportStudios() {
    const studios = await Studio.query();
    log.info(`Exporting ${studios.length} studios...`);
    for (const studio of studios) {
      this.mappings.studios.push({ name: studio.name!, checksum: studio.checksum! });

      const json: Partial<IStudioJson> = {};
      if (!!studio.name || studio.name === "") { json.name = studio.name; }
      if (!!studio.url || studio.url === "") { json.url = studio.url; }
      json.image = ImageUtils.encodeBase64Image(studio);

      const studioJson = await StashJson.getStudio(studio.checksum!);
      if (JSON.stringify(studioJson) === JSON.stringify(json)) { continue; }

      await StashJson.saveStudio(studio.checksum!, json as any);
    }

    log.info(`Exporting studios complete`);
  }

  private async exportScraped() {
    const results: IScrapedItemJson[] = [];
    const scrapedItems = await ScrapedItem.query();
    log.info(`Exporting ${scrapedItems.length} scraped items...`);
    for (const scrapedItem of scrapedItems) {
      await scrapedItem.$relatedQuery("studio");

      const json: Partial<IScrapedItemJson> = {};
      if (!!scrapedItem.title || scrapedItem.title === "") { json.title = scrapedItem.title; }
      if (!!scrapedItem.description || scrapedItem.description === "") { json.description = scrapedItem.description; }
      if (!!scrapedItem.url || scrapedItem.url === "") { json.url = scrapedItem.url; }
      if (!!scrapedItem.date || scrapedItem.date === "") { json.date = scrapedItem.date; }
      if (!!scrapedItem.rating || scrapedItem.rating === "") { json.rating = scrapedItem.rating; }
      if (!!scrapedItem.tags || scrapedItem.tags === "") { json.tags = scrapedItem.tags; }
      if (!!scrapedItem.models || scrapedItem.models === "") { json.models = scrapedItem.models; }
      if (!!scrapedItem.episode) { json.episode = scrapedItem.episode; }
      if (!!scrapedItem.gallery_filename || scrapedItem.gallery_filename === "") {
        json.gallery_filename = scrapedItem.gallery_filename;
      }
      if (!!scrapedItem.gallery_url || scrapedItem.gallery_url === "") {
        json.gallery_url = scrapedItem.gallery_url;
      }
      if (!!scrapedItem.video_filename || scrapedItem.video_filename === "") {
        json.video_filename = scrapedItem.video_filename;
      }
      if (!!scrapedItem.video_url || scrapedItem.video_url === "") { json.video_url = scrapedItem.video_url; }
      json.studio = scrapedItem.studio!.name;
      // TODO: Keeping the rails format
      json.updated_at = scrapedItem.updated_at!.replace(/T/, " ").replace(/\..+/, " UTC");

      results.push(json as any);
    }

    await StashJson.saveScraped(results);
    log.info(`Exporting scraped items complete`);
  }

  private getNames(objects: Array<Partial<{name: string}>>) {
    if (objects.length === 0) { return []; }

    const results = [];
    for (const object of objects) {
      if (!!object.name) {
        results.push(object.name);
      }
    }
    return results;
  }

  private getDecimalString(num: number | null | undefined): any {
    if (num === null || num === undefined) { return null; }
    let precision = this.getPrecision(num);
    if (precision === 0) { precision = 1; }
    return num.toFixed(precision);
  }

  private getPrecision(a: number) {
    if (a === null || !isFinite(a)) { return 0; }
    let e = 1;
    let p = 0;
    while (Math.round(a * e) / e !== a) { e *= 10; p++; }
    return p;
  }
}
