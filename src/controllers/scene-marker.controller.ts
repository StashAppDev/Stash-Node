import { Database } from "../db/database";
import { ITagAttributes } from "../db/models/tag.model";
import { GQL, QueryResolvers } from "../typings/graphql";
import { getEntity } from "./utils";

export class SceneMarkerController {

  // #region GraphQL Resolvers

  // TODO: test
  public static sceneMarkerTags: QueryResolvers.SceneMarkerTagsResolver = async (root, args, context, info) => {
    const tags: { [s: number]: GQL.SceneMarkerTag } = {};
    const scene = await getEntity(Database.Scene, { id: args.scene_id! });
    const markers = await scene.getScene_markers();
    for (const marker of markers) {
      const primaryTag = await marker.getPrimary_tag();
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

  // TODO
  private static tagModelToGraphQL(t: ITagAttributes): GQL.Tag {
    return {
      id: t.id!.toString(),
      name: t.name,
    };
  }
}
