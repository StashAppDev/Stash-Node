import { transaction, Transaction } from "objection";
import { Database } from "../../db/database";
import { Gallery } from "../../db/models/gallery.model";
import { Performer } from "../../db/models/performer.model";
import { SceneMarker } from "../../db/models/scene-marker.model";
import { Scene } from "../../db/models/scene.model";
import { ScrapedItem } from "../../db/models/scraped-item.model";
import { Studio } from "../../db/models/studio.model";
import { Tag } from "../../db/models/tag.model";
import { log } from "../../logger";
import { IMappingJson, ISceneJson, ISceneMarkerJson, IScrapedJson, StashJson } from "../json.stash";
import { StashManager } from "../manager.stash";
import { BaseTask } from "./base.task";

export class ExportTask extends BaseTask {
  private mappings: IMappingJson = { performers: [], studios: [], galleries: [], scenes: []};
  private scraped: IScrapedJson;

  constructor() {
    super();
  }

  public async start() {
    // @manager.total = Scene.count + Gallery.count + Performer.count + Studio.count

    await this.exportScenes();
    // export_galleries
    // export_performers
    // export_studios

    // Stash::JSONUtility.save_mappings(json: @mappings)

    // export_scraped
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
          await marker.$relatedQuery("tags");
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

      StashJson.saveScene(scene.checksum!, json);
    }

    log.info(`Exporting scenes complete`);
  }

  private getNames(objects: Array<Partial<{name: string}>>) {
    if (objects.length === 0) { return []; }

    const results = [];
    for (const object of objects) {
      if (!!object.name) {
        results.push(object.name);
      }
    }
    // TODO: Sort
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
