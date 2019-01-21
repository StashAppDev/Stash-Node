import { SceneMarker } from "../db/models/scene-marker.model";
import { GQL } from "../typings/graphql";
import { BaseQueryBuilder } from "./base.querybuilder";

export class SceneMarkerQueryBuilder extends BaseQueryBuilder<SceneMarker> {
  public args: GQL.FindSceneMarkersQueryArgs;

  constructor(args: GQL.FindSceneMarkersQueryArgs) {
    super(SceneMarker, args.filter);
    this.args = args;
  }

  public filter() {
    this.leftJoinRelation("primary_tag");
    this.leftJoinRelation("tags");
    this.leftJoinRelation("scene");

    if (!this.args.scene_marker_filter) { return this; }
    const sceneMarkerFilter = this.args.scene_marker_filter;

    if (!!sceneMarkerFilter.tag_id) {
      this.tagId(sceneMarkerFilter.tag_id);
    }
    if (!!sceneMarkerFilter.tags) {
      this.tags(sceneMarkerFilter.tags);
    }
    if (!!sceneMarkerFilter.scene_tags) {
      this.sceneTags(sceneMarkerFilter.scene_tags);
    }
    if (!!sceneMarkerFilter.performers) {
      this.performers(sceneMarkerFilter.performers);
    }

    return this;
  }

  public search() {
    const q = this.findFilter.q;
    if (!q) { return this; }
    this
    //  # scoped_search relation: :primary_tag, on: :name
    // # scoped_search relation: :tags, on: :name
    .where((builder) => {
      builder
        .where("scene_markers.title", "LIKE", `%${q}%`)
        .orWhere("scene.title", "LIKE", `%${q}%`);
    });
    return this;
  }

  private tagId(id: string) {
    return this
      .where((b) => {
        b.where("scene_markers.primary_tag_id", "=", id)
          .orWhere("tags.id", "=", id);
      })
      .distinct();
  }

  private tags(ids: string[]) {
    if (ids.length === 0) { return this; }

    // select `scene_markers`.* from `scene_markers`
    // left join `tags` as `primary_tags_join`
    //   on `primary_tags_join`.`id` = `scene_markers`.`primary_tag_id`
    //   and `primary_tags_join`.`id` in ('3', '37', '9', '89')
    // left join `scene_markers_tags` as `tags_join`
    //   on `tags_join`.`scene_marker_id` = `scene_markers`.`id`
    //   and `tags_join`.`tag_id` in ('3', '37', '9', '89')
    // group by `scene_markers`.`id`
    // having ((count(distinct `primary_tags_join`.`id`) + count(distinct `tags_join`.`tag_id`)) = 4)

    const query = this
      .leftJoin("tags as ptj", (builder) => {
        builder
          .on("ptj.id", "scene_markers.primary_tag_id")
          .onIn("ptj.id", ids);
      })
      .leftJoin("scene_markers_tags as tj", (builder) => {
        builder
          .on("tj.scene_marker_id", "scene_markers.id")
          .onIn("tj.tag_id", ids);
      })
      .groupBy("scene_markers.id")
      .havingRaw("(count(distinct `ptj`.`id`) + count(distinct `tj`.`tag_id`)) is ?", ids.length);

    return query;
  }

  private sceneTags(ids: string[]) {
    if (ids.length === 0) { return this; }

    const query = this
      .leftJoin("scenes_tags as scene_tags_join", (builder) => {
        builder
          .on("scene_tags_join.scene_id", "scene.id")
          .onIn("scene_tags_join.tag_id", ids);
      })
      .groupBy("scene_markers.id")
      .havingRaw("count(distinct `scene_tags_join`.`tag_id`) is ?", ids.length);

    return query;
  }

  private performers(ids: string[]) {
    if (ids.length === 0) { return this; }

    const query = this
      .leftJoin("performers_scenes as scene_performers", "scene.id", "scene_performers.scene_id")
      .whereIn("scene_performers.performer_id", ids);

    return query;
  }
}
