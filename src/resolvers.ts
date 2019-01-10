import { importSchema } from "graphql-import";
import gql from "graphql-tag";
import path from "path";
import { URL } from "url";
import { GalleryController } from "./controllers/gallery.controller";
import { SceneMarkerController } from "./controllers/scene-marker.controller";
import { SceneController } from "./controllers/scene.controller";
import { StudioController } from "./controllers/studio.controller";
import { TagController } from "./controllers/tag.controller";
import { Database } from "./db/database";
import { SceneHelper } from "./db/models/scene.model";
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
  Query: {
    findGallery(root, args, context, info) { return GalleryController.findGallery(root, args, context, info); },
    findTag(root, args, context, info) { return TagController.findTag(root, args, context, info); },
    findScene(root, args, context, info) { return SceneController.findScene(root, args, context, info); },
    findScenes(root, args, context, info) { return SceneController.findScenes(root, args, context, info); },
    findStudio(root, args, context, info) { return StudioController.findStudio(root, args, context, info); },
    sceneMarkerTags(root, args, context, info) {
      return SceneMarkerController.sceneMarkerTags(root, args, context, info);
    },
    async stats(root, args, context, info) {
      // tslint:disable:variable-name
      const scene_count = await Database.Scene.count();
      const gallery_count = await Database.Gallery.count();
      const performer_count = await Database.Performer.count();
      const studio_count = await Database.Studio.count();
      const tag_count = await Database.Tag.count();
      return { scene_count, gallery_count, performer_count, studio_count, tag_count };
      // tslint:enable:variable-name
    },

    async allPerformers() { return await Database.Performer.findAll(); },
    async allStudios() { return await Database.Studio.findAll(); },
    async allTags() { return await Database.Tag.findAll(); },
    async allSceneMarkers() { return await Database.SceneMarker.findAll(); },
  },
  Scene: {
    file(scene, args, context, info) {
      return {
        audio_codec: scene.audioCodec,
        bitrate: scene.bitrate,
        duration: scene.duration,
        framerate: scene.framerate,
        height: scene.height,
        size: scene.size,
        video_codec: scene.videoCodec,
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
    is_streamable(scene, args, context, info): boolean { return SceneHelper.isStreamable(scene); },

    // TODO: remove these.  Don't need these resolvers
    async scene_markers(scene) {
      const sceneMarkers =  await scene.getScene_markers();
      return !!sceneMarkers ? sceneMarkers : [];
    },
    async gallery(scene) {
      const gallery = await scene.getGallery();
      return !!gallery ? gallery : undefined;
    },
    async studio(scene) {
      const studio =  await scene.getStudio();
      return !!studio ? studio : undefined;
    },
    async tags(scene) {
      const tags = await scene.getTags();
      return !!tags ? tags : [];
    },
    async performers(scene) {
      const performers = await scene.getPerformers();
      return !!performers ? performers : [];
    },
    async scene_marker_tags(scene, args, context, info) {
      // TODO: Remove this.  Apollo has a bug where "scene_marker_tags" query wont work when updating markers.
      // https://github.com/apollographql/apollo-client/issues/1821
      return await SceneMarkerController.sceneMarkerTags(scene, {scene_id: scene!.id!.toString(10)}, context, info);
    },
  },
  SceneMarker: {
    preview() { return ""; }, // TODO
    stream() { return ""; }, // TODO
  },
  Studio: {
    image_path() {
      // TODO: ctx[:routes].studio_image_url(studio.id, host: ctx[:base_url])
      return "";
    },
    async scene_count(studio) { return await studio.countScenes(); },
  },
  Tag: {
    async scene_count(tag) { return await tag.countScenes(); },
    async scene_marker_count(tag) { return await tag.countPrimary_scene_markers() + await tag.countScene_markers(); },
  },
};
