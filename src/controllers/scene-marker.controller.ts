import express from "express";
import { SceneMarker } from "../db/models/scene-marker.model";
import { Scene } from "../db/models/scene.model";
import { Tag } from "../db/models/tag.model";
import { SceneMarkerQueryBuilder } from "../querybuilders/scene-marker.querybuilder";
import { Stash } from "../stash/stash";
import { GQL, QueryResolvers } from "../typings/graphql";
import { ObjectionUtils } from "../utils/objection.utils";

export class SceneMarkerController {

  // #region GraphQL Resolvers

  // TODO:  Missing rails logic
  public static findSceneMarkers: QueryResolvers.FindSceneMarkersResolver = async (root, args, context, info) => {
    const builder = new SceneMarkerQueryBuilder(args);
    builder.filter();
    builder.search();
    builder.sort("title");

    const pages = await builder.paginate();
    const totalSize = await builder.resultSize();

    // TODO: Model instance doesn't match the GQL interface... remove any?
    // https://github.com/dotansimha/graphql-code-generator/issues/1041
    return { scene_markers: pages.results, count: totalSize } as any;
  }

  // TODO: test
  public static sceneMarkerTags: QueryResolvers.SceneMarkerTagsResolver = async (root, args, context, info) => {
    const tags: { [s: number]: GQL.SceneMarkerTag } = {};
    const scene = await ObjectionUtils.getEntity(Scene, { id: args.scene_id! });
    const markers = await scene.$relatedQuery<SceneMarker>("scene_markers");
    for (const marker of markers) {
      const primaryTag = await marker.$relatedQuery<Tag>("primary_tag").first();
      if (!primaryTag!.id) { throw Error("What?"); }
      if (!tags.hasOwnProperty(primaryTag!.id!)) {
        tags[primaryTag!.id!] = { tag: SceneMarkerController.tagModelToGraphQL(primaryTag!), scene_markers: [] };
      }
      const m = marker.toJSON() as any;
      m.scene = scene.toJSON();
      m.primary_tag = primaryTag!.toJSON();
      m.tags = [];
      tags[primaryTag!.id!].scene_markers.push(m as any); // TODO

    }

    return Object.values(tags);
  }

  // #endregion

  // GET /scenes/:scene_id/scene_markers/:id/stream
  public static async stream(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      const scene = await ObjectionUtils.getEntity(Scene, { id: req.params.scene_id });
      const sceneMarker = await ObjectionUtils.getEntity(SceneMarker, { id: req.params.id! });

      const streamPath = Stash.paths.sceneMarker.getStreamPath(scene.checksum!, sceneMarker.seconds!);

      const sendFileOptions = {
        maxAge: 604800000, // 1 Week
      };

      res.sendFile(streamPath, sendFileOptions);
    } catch (e) {
      next(e);
    }
  }

  // GET /scenes/:scene_id/scene_markers/:id/preview
  public static async preview(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      const scene = await ObjectionUtils.getEntity(Scene, { id: req.params.scene_id });
      const sceneMarker = await ObjectionUtils.getEntity(SceneMarker, { id: req.params.id! });

      const previewPath = Stash.paths.sceneMarker.getStreamPreviewImagePath(scene.checksum!, sceneMarker.seconds!);

      const sendFileOptions = {
        maxAge: 604800000, // 1 Week
      };

      res.sendFile(previewPath, sendFileOptions);
    } catch (e) {
      next(e);
    }
  }

  // TODO
  private static tagModelToGraphQL(t: Tag): GQL.Tag {
    return {
      id: t.id!.toString(),
      name: t.name!,
    };
  }
}
