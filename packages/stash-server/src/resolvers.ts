import { importSchema } from "graphql-import";
import gql from "graphql-tag";
import path from "path";
import { GalleryController } from "./controllers/gallery.controller";
import { PerformerController } from "./controllers/performer.controller";
import { SceneMarkerController } from "./controllers/scene-marker.controller";
import { SceneController } from "./controllers/scene.controller";
import { StudioController } from "./controllers/studio.controller";
import { TagController } from "./controllers/tag.controller";
import { Gallery } from "./db/models/gallery.model";
import { Performer } from "./db/models/performer.model";
import { SceneMarker } from "./db/models/scene-marker.model";
import { Scene } from "./db/models/scene.model";
import { Studio } from "./db/models/studio.model";
import { Tag } from "./db/models/tag.model";
import { GalleryRoutes } from "./routes/gallery.route";
import { PerformerRoutes } from "./routes/performer.route";
import { SceneRoutes } from "./routes/scene.route";
import { StudioRoutes } from "./routes/studio.route";
import { FreeonesScraper } from "./scrapers/freeones";
import { IResolvers } from "./typings/graphql";
import { ObjectionUtils } from "./utils/objection.utils";

// NOTE: This path looks weird, but is required for pkg
const schemaPath = path.join(__dirname, "../src/schema.graphql");
const schemaString = importSchema(schemaPath);
export const typeDefs = gql`
  ${schemaString}
`;

export const resolvers: IResolvers = {
  Gallery: {
    async files(gallery, args, context, info) {
      const files = await gallery.getFiles();
      return files.map((filePath: string, index: number) => {
        return {
          index,
          name: path.basename(filePath),
          path: GalleryRoutes.getGalleryImageUrl(context.baseUrl, gallery.id, index),
        };
      });
    },
  },
  Mutation: {
    // sceneUpdate(root, args, context, info) { return SceneController.sceneUpdate(root, args, context, info); },

    sceneMarkerCreate(root, args, context, info) {
      return SceneMarkerController.sceneMarkerCreate(root, args, context, info);
    },
    sceneMarkerUpdate(root, args, context, info) {
      return SceneMarkerController.sceneMarkerUpdate(root, args, context, info);
    },
    sceneMarkerDestroy(root, args, context, info) {
      return SceneMarkerController.sceneMarkerDestroy(root, args, context, info);
    },

    performerCreate(root, args, context, info) {
      return PerformerController.performerCreate(root, args, context, info);
    },
    performerUpdate(root, args, context, info) {
      return PerformerController.performerUpdate(root, args, context, info);
    },

    studioCreate(root, args, context, info) { return StudioController.studioCreate(root, args, context, info); },
    studioUpdate(root, args, context, info) { return StudioController.studioUpdate(root, args, context, info); },

    tagCreate(root, args, context, info) { return TagController.tagCreate(root, args, context, info); },
    tagDestroy(root, args, context, info) { return TagController.tagDestroy(root, args, context, info); },
    tagUpdate(root, args, context, info) { return TagController.tagUpdate(root, args, context, info); },
  },
  Performer: {
    image_path(performer, args, context) {
      if (!performer.id) { throw new Error(`Missing performer id!`); }
      return PerformerRoutes.getPerformerImageUrl(context.baseUrl, performer.id);
    },
    scene_count(performer) {
      return ObjectionUtils.getCountFromQueryBuilder(performer.$relatedQuery<any>("scenes"));
    },
  },
  Query: {
    findGallery(root, args, context, info) { return GalleryController.findGallery(root, args, context, info); },
    findGalleries(root, args, context, info) { return GalleryController.findGalleries(root, args, context, info); },
    findPerformer(root, args, context, info) { return PerformerController.findPerformer(root, args, context, info); },
    findPerformers(root, args, context, info) { return PerformerController.findPerformers(root, args, context, info); },
    findTag(root, args, context, info) { return TagController.findTag(root, args, context, info); },
    findScene(root, args, context, info) { return SceneController.findScene(root, args, context, info); },
    findScenes(root, args, context, info) { return SceneController.findScenes(root, args, context, info); },
    findSceneMarkers(root, args, context, info) {
      return SceneMarkerController.findSceneMarkers(root, args, context, info);
    },
    findStudio(root, args, context, info) { return StudioController.findStudio(root, args, context, info); },
    findStudios(root, args, context, info) { return StudioController.findStudios(root, args, context, info); },

    markerWall(root, args, context, info) {
      return SceneMarker.query().where("scene_markers.title", "LIKE", `%${args.q}%`).limit(80).orderByRaw("RANDOM()");
    },
    sceneWall(root, args, context, info) {
      return Scene.query().where("scenes.details", "LIKE", `%${args.q}%`).limit(80).orderByRaw("RANDOM()");
    },

    markerStrings(root, args, context, info) { return SceneMarkerController.markerStrings(root, args, context, info); },
    sceneMarkerTags(root, args, context, info) {
      return SceneMarkerController.sceneMarkerTags(root, args, context, info);
    },
    async stats(root, args, context, info) {
      // tslint:disable:variable-name
      const scene_count = await ObjectionUtils.getCount(Scene);
      const gallery_count = await ObjectionUtils.getCount(Gallery);
      const performer_count = await ObjectionUtils.getCount(Performer);
      const studio_count = await ObjectionUtils.getCount(Studio);
      const tag_count = await ObjectionUtils.getCount(Tag);
      return { scene_count, gallery_count, performer_count, studio_count, tag_count };
      // tslint:enable:variable-name
    },
    validGalleriesForScene(root, args, context, info) {
      return SceneController.validGalleries(root, args, context, info);
    },

    scrapeFreeones(root, args, context, info) {
      const scraper = new FreeonesScraper();
      return scraper.getPerformer(args.performer_name);
    },
    scrapeFreeonesPerformerList(root, args, context, info) {
      const scraper = new FreeonesScraper();
      return scraper.getPerformerNames(args.query);
    },

    // TODO: metadataImport
    // TODO: metadataExport
    // TODO: metadataScan
    // TODO: metadataGenerate
    // TODO: metadataClean

    async allPerformers() { return await Performer.query().select("id", "name", "birthdate"); },
    async allStudios() { return await Studio.query(); },
    async allTags() { return await Tag.query().select("id", "name").orderBy("name"); },
  },
  Scene: {
    file(scene, args, context, info) {
      return {
        audio_codec: scene.audio_codec,
        bitrate: scene.bitrate,
        duration: scene.duration,
        framerate: scene.framerate,
        height: scene.height,
        size: scene.size,
        video_codec: scene.video_codec,
        width: scene.width,
      };
    },
    paths(scene, args, context, info) { return SceneRoutes.buildScenePaths(scene, context); },
    async is_streamable(scene, args, context, info) { return await scene.isStreamable(); },

    // TODO: remove these.  Don't need these resolvers
    async scene_markers(scene) {
      const sceneMarkers = await scene.$relatedQuery<SceneMarker>("scene_markers");
      return !!sceneMarkers ? sceneMarkers : [];
    },
    async gallery(scene) {
      const gallery = await scene.$relatedQuery<Gallery>("gallery").first();
      return !!gallery ? gallery : undefined;
    },
    async studio(scene) {
      const studio = await scene.$relatedQuery<Studio>("studio").first();
      return !!studio ? studio : undefined;
    },
    async tags(scene) {
      const tags = await scene.$relatedQuery<Tag>("tags");
      return !!tags ? tags : [];
    },
    async performers(scene) {
      const performers = await scene.$relatedQuery<Performer>("performers");
      return !!performers ? performers : [];
    },
  },
  SceneMarker: {
    preview(sceneMarker, args, context, info) {
      if (!sceneMarker.id) { throw new Error(`Missing scene marker id`); }
      return SceneRoutes.getSceneMarkerStreamPreviewImageUrl(context.baseUrl, sceneMarker.scene_id, sceneMarker.id);
    },
    primary_tag(sceneMarker) {
      if (!!sceneMarker.primary_tag) {
        return sceneMarker.primary_tag;
      } else {
        return sceneMarker.$relatedQuery("primary_tag").first() as any;
      }
    },
    stream(sceneMarker, args, context, info) {
      if (!sceneMarker.id) { throw new Error(`Missing scene marker id`); }
      return SceneRoutes.getSceneMarkerStreamUrl(context.baseUrl, sceneMarker.scene_id, sceneMarker.id);
    },
    scene(sceneMarker) {
      if (!!sceneMarker.scene) {
        return sceneMarker.scene;
      } else {
        return sceneMarker.$relatedQuery("scene").first() as any;
      }
    },
    tags(sceneMarker, args, context, info) {
      if (!!sceneMarker.tags) {
        return sceneMarker.tags;
      } else {
        return sceneMarker.$relatedQuery("tags") as any;
      }
    },
  },
  Studio: {
    image_path(studio, args, context, info) {
      if (!studio.id) { throw new Error(`Missing studio id!`); }
      return StudioRoutes.getStudioImageUrl(context.baseUrl, studio.id);
    },
    scene_count(studio) {
      return ObjectionUtils.getCountFromQueryBuilder(studio.$relatedQuery<any>("scenes"));
    },
  },
  Tag: {
    scene_count(tag) {
      return ObjectionUtils.getCountFromQueryBuilder(tag.$relatedQuery<any>("scenes"));
    },
    async scene_marker_count(tag) {
      const primarySceneMarkersCount =
        await ObjectionUtils.getCountFromQueryBuilder(tag.$relatedQuery<any>("primary_scene_markers"));
      const sceneMarkersCount =
        await ObjectionUtils.getCountFromQueryBuilder(tag.$relatedQuery<any>("scene_markers"));
      return primarySceneMarkersCount + sceneMarkersCount;
    },
  },
};
