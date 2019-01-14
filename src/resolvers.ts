import { importSchema } from "graphql-import";
import gql from "graphql-tag";
import path from "path";
import { URL } from "url";
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
import { IResolvers } from "./typings/graphql";

// NOTE: This path looks weird, but is required for pkg
const schemaPath = path.join(__dirname, "../src/schema.graphql");
const schemaString = importSchema(schemaPath);
export const typeDefs = gql`
  ${schemaString}
`;

export const resolvers: IResolvers = {
  Gallery: {
    files(root, args, context, info) {
      // TODO: Find files for given root id
      // GalleryController.find(root.id);
      return [];
    },
  },
  Mutation: {
    studioCreate(root, args, context, info) { return StudioController.studioCreate(root, args, context, info); },
    studioUpdate(root, args, context, info) { return StudioController.studioUpdate(root, args, context, info); },
    tagCreate(root, args, context, info) { return TagController.tagCreate(root, args, context, info); },
    tagUpdate(root, args, context, info) { return TagController.tagUpdate(root, args, context, info); },
  },
  Performer: {
    image_path(root, args, context) { return new URL(`/performers/${root.id}/image`, context.baseUrl).toString(); },
  },
  Query: {
    findGallery(root, args, context, info) { return GalleryController.findGallery(root, args, context, info); },
    findPerformer(root, args, context, info) { return PerformerController.findPerformer(root, args, context, info); },
    findPerformers(root, args, context, info) { return PerformerController.findPerformers(root, args, context, info); },
    findTag(root, args, context, info) { return TagController.findTag(root, args, context, info); },
    findScene(root, args, context, info) { return SceneController.findScene(root, args, context, info); },
    findScenes(root, args, context, info) { return SceneController.findScenes(root, args, context, info); },
    findSceneMarkers(root, args, context, info) {
      return SceneMarkerController.findSceneMarkers(root, args, context, info);
    },
    findStudio(root, args, context, info) { return StudioController.findStudio(root, args, context, info); },
    sceneMarkerTags(root, args, context, info) {
      return SceneMarkerController.sceneMarkerTags(root, args, context, info);
    },
    async stats(root, args, context, info) {
      // tslint:disable:variable-name
      const scene_count = (await Scene.knexQuery().count())[0]["count(*)"];
      const gallery_count = (await Gallery.knexQuery().count())[0]["count(*)"];
      const performer_count = (await Performer.knexQuery().count())[0]["count(*)"];
      const studio_count = (await Studio.knexQuery().count())[0]["count(*)"];
      const tag_count = (await Tag.knexQuery().count())[0]["count(*)"];
      return { scene_count, gallery_count, performer_count, studio_count, tag_count };
      // tslint:enable:variable-name
    },

    async allPerformers() { return await Performer.query(); },
    async allStudios() { return await Studio.query(); },
    async allTags() { return await Tag.query(); },
    async allSceneMarkers() { return await SceneMarker.query(); },
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
    paths(root, args, context, info) {
      return {
        // TODO:  Get these paths from the resolver?
        chapters_vtt: new URL(`/scenes/${root.id}/vtt/chapter`, context.baseUrl).toString(),
        preview: new URL(`/scenes/${root.id}/preview`, context.baseUrl).toString(),
        screenshot: new URL(`/scenes/${root.id}/screenshot`, context.baseUrl).toString(),
        stream: new URL(`/scenes/${root.id}/stream.mp4`, context.baseUrl).toString(),
        vtt: new URL(`/scenes/${root.id}_thumbs.vtt`, context.baseUrl).toString(),
        webp: new URL(`/scenes/${root.id}/webp`, context.baseUrl).toString(),
      };
    },
    is_streamable(scene, args, context, info): boolean { return scene.isStreamable(); },

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
    async scene_marker_tags(scene, args, context, info) {
      // TODO: Remove this.  Apollo has a bug where "scene_marker_tags" query wont work when updating markers.
      // https://github.com/apollographql/apollo-client/issues/1821
      return await SceneMarkerController.sceneMarkerTags(scene, {scene_id: scene!.id!.toString(10)}, context, info);
    },
  },
  SceneMarker: {
    preview(sceneMarker, args, context, info) {
      const urlPath = `/scenes/${sceneMarker.scene_id}/scene_markers/${sceneMarker.id}/preview`;
      return new URL(urlPath, context.baseUrl).toString();
    },
    primary_tag(sceneMarker) {
      if (!!sceneMarker.primary_tag) {
        return sceneMarker.primary_tag;
      } else {
        return sceneMarker.$relatedQuery("primary_tag").first() as any;
      }
    },
    stream(sceneMarker, args, context, info) {
      const urlPath = `/scenes/${sceneMarker.scene_id}/scene_markers/${sceneMarker.id}/stream`;
      return new URL(urlPath, context.baseUrl).toString();
    },
    scene(sceneMarker) {
      if (!!sceneMarker.scene) {
        return sceneMarker.scene;
      } else {
        return sceneMarker.$relatedQuery("scene").first() as any;
      }
    },
    tags(sceneMarker) {
      if (!!sceneMarker.tags) {
        return sceneMarker.tags;
      } else {
        return sceneMarker.$relatedQuery("tags") as any;
      }
    },
  },
  Studio: {
    image_path() {
      // TODO: ctx[:routes].studio_image_url(studio.id, host: ctx[:base_url])
      return "";
    },
    async scene_count(studio) {
      return (await studio.$relatedQuery<any>("scenes").count())[0]["count(*)"];
    },
  },
  Tag: {
    async scene_count(tag) {
      return (await tag.$relatedQuery<any>("scenes").count())[0]["count(*)"];
    },
    async scene_marker_count(tag) {
      const primarySceneMarkers = (await tag.$relatedQuery<any>("primary_scene_markers").count())[0]["count(*)"];
      const sceneMarkers = (await tag.$relatedQuery<any>("scene_markers").count())[0]["count(*)"];
      return primarySceneMarkers + sceneMarkers;
    },
  },
};
