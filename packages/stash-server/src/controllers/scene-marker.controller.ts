import express from "express";
import { raw, transaction } from "objection";
import { SceneMarker } from "../db/models/scene-marker.model";
import { Scene } from "../db/models/scene.model";
import { Tag } from "../db/models/tag.model";
import { SceneMarkerQueryBuilder } from "../querybuilders/scene-marker.querybuilder";
import { Stash } from "../stash/stash";
import { GQL, MutationResolvers, QueryResolvers } from "../typings/graphql";
import { ObjectionUtils } from "../utils/objection.utils";

export class SceneMarkerController {

  // #region GraphQL Resolvers

  public static findSceneMarkers: QueryResolvers.FindSceneMarkersResolver = async (root, args, context, info) => {
    const builder = new SceneMarkerQueryBuilder(args);
    builder.filter();
    builder.search();
    builder.sort("title");

    const page = await builder.paginate();
    // TODO: Model instance doesn't match the GQL interface... remove any?
    // https://github.com/dotansimha/graphql-code-generator/issues/1041
    return { scene_markers: page.results, count: page.total } as any;
  }

  public static sceneMarkerCreate: MutationResolvers.SceneMarkerCreateResolver = async (root, args, context, info) => {
    const tagIds = args.input.tag_ids || [];
    const tags = tagIds.map((tagId) => ({ id: parseInt(tagId, 10) } as any));
    return transaction(SceneMarker.knex(), (trx) => {
      return SceneMarker.query(trx)
        .insertGraphAndFetch({
          title: args.input.title,
          seconds: args.input.seconds,
          scene_id: parseInt(args.input.scene_id, 10),
          primary_tag_id: parseInt(args.input.primary_tag_id, 10),
          tags,
        },
        {
          relate: true,
        });
    });
  }

  public static sceneMarkerUpdate: MutationResolvers.SceneMarkerUpdateResolver = async (root, args, context, info) => {
    const tagIds = args.input.tag_ids || [];
    const tags = tagIds.map((tagId) => ({ id: parseInt(tagId, 10) } as any));
    return transaction(SceneMarker.knex(), (trx) => {
      return SceneMarker.query(trx)
        .upsertGraphAndFetch({
          id: parseInt(args.input.id, 10),
          title: args.input.title,
          seconds: args.input.seconds,
          scene_id: parseInt(args.input.scene_id, 10),
          primary_tag_id: parseInt(args.input.primary_tag_id, 10),
          tags,
        },
        {
          relate: true,
          unrelate: true,
        });
    });
  }

  public static sceneMarkerDestroy:
    MutationResolvers.SceneMarkerDestroyResolver = async (root, args, context, info) => {
    const numberOfRows = await SceneMarker.query().deleteById(parseInt(args.id, 10));
    return numberOfRows === 1;
  }

  /**
   * Get scene marker tags which show up under the video.
   */
  public static sceneMarkerTags: QueryResolvers.SceneMarkerTagsResolver = async (root, args, context, info) => {
    const tags: { [s: number]: GQL.SceneMarkerTag } = {};
    const scene = await ObjectionUtils.getEntity(Scene, { id: args.scene_id! });
    const markers = await scene.$relatedQuery<SceneMarker>("scene_markers").orderBy("scene_markers.seconds", "ASC");
    for (const marker of markers) {
      const markerPrimaryTag = await marker.$relatedQuery<Tag>("primary_tag").first();
      if (!markerPrimaryTag || !markerPrimaryTag.id) { throw Error("Missing primary tag"); }
      if (!tags.hasOwnProperty(markerPrimaryTag.id)) {
        tags[markerPrimaryTag.id] = { tag: markerPrimaryTag.toGraphQL(), scene_markers: [] };
      }
      tags[markerPrimaryTag.id].scene_markers.push(marker as any);
    }

    // Sort so that primary tags that show up earlier in the video are first.
    return Object.values(tags).sort((a, b) => {
      return a.scene_markers[0]!.seconds - b.scene_markers[0]!.seconds;
    });
  }

  /**
   * Returns an array of strings representing titles used for scene markers.  Includes a count value for each usage of
   * that title.
   */
  public static markerStrings: QueryResolvers.MarkerStringsResolver = async (root, args, context, info) => {
    const markerStringsQueryBuilder = SceneMarker.query()
      .select(
        raw("count(*) as count_all"),
        "scene_markers.title",
      );
    if (!!args.q) { markerStringsQueryBuilder.where("scene_markers.title", "LIKE", `%${args.q}%`); }
    markerStringsQueryBuilder
      .orderBy("scene_markers.title")
      .groupBy(["title"]);
    const results = (await markerStringsQueryBuilder).map<GQL.MarkerStringsResultType>((marker) => {
      return { id: marker.title, title: marker.title, count: (marker as any).count_all };
    });
    if (args.sort === "count") {
      return results.sort((a, b) => {
        if (a.count < b.count) { return -1; }
        if (a.count > b.count) { return 1; }
        return 0;
      }).reverse();
    } else {
      return results;
    }
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
}
