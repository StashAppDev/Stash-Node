import { SceneMarker } from "../db/models/scene-marker.model";
import { GQL, Maybe } from "../typings/graphql";
import { BaseQueryBuilder } from "./base.querybuilder";

export class SceneMarkerQueryBuilder extends BaseQueryBuilder<SceneMarker> {
  public args: GQL.FindSceneMarkersQueryArgs;

  constructor(args: GQL.FindSceneMarkersQueryArgs) {
    super(SceneMarker, args.filter);
    this.args = args;
  }

  public filter() {
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
    .leftJoinRelation("scene")
    .where((builder) => {
      builder
        .where("scene_markers.title", "LIKE", `%${q}%`)
        .orWhere("scene.title", "LIKE", `%${q}%`);
    });
    return this;
  }

  private tagId(id: string) {
    return this.
      leftJoinRelation("tags")
      .where((b) => {
        b.where("scene_markers.primary_tag_id", "=", id)
          .orWhere("tags.id", "=", id);
      })
      .distinct();
  }

  private tags(ids: Array<Maybe<string>>) {
    // tag_ids = tag_ids.map { |id| id.to_i  }.uniq

    // markers = left_outer_joins(:tags)
    //             .where(:scene_markers => {:primary_tag_id => tag_ids})
    //             .distinct

    // ids = []
    // if markers.count == 0
    //   return left_outer_joins(:tags)
    //             .where(:tags => {:id => tag_ids})
    //             .group("scene_markers.id")
    //             .having("count(taggings.tag_id) = #{tag_ids.length}")
    //             .unscope(:order)
    //             .distinct
    // else
    //   ids += left_outer_joins(:tags)
    //             .where(:tags => {:id => tag_ids})
    //             .group("scene_markers.id")
    //             .having("count(taggings.tag_id) = #{tag_ids.length}")
    //             .unscope(:order)
    //             .distinct
    //             .pluck(:id)
    // end

    // markers.each { |marker|
    //   difference = tag_ids - [marker.primary_tag_id]
    //   difference = difference - marker.tags.pluck(:id)

    //   ids << marker.id if difference.length == 0
    // }

    // where(id: ids.uniq)
  }

  private sceneTags(ids: Array<Maybe<string>>) {
    // tag_ids = scene_tag_ids.map { |id| id.to_i  }.uniq

    // left_outer_joins(scene: [:tags])
    //   .where(scene: {taggings: {tag_id: tag_ids}})
    //   .group("scene_markers.id")
    //   .having("count(taggings.tag_id) = #{scene_tag_ids.length}")
    //   .distinct
  }

  // scope :marker_and_scene_tags, -> (marker_tag_ids, scene_tag_ids) {
  //   scene_tag_ids = scene_tag_ids.map { |id| id.to_i  }.uniq
  //   marker_tag_ids = marker_tag_ids.map { |id| id.to_i  }.uniq
  //
  //   scene = scene_tags(scene_tag_ids)
  //   marker = tags(marker_tag_ids)
  //
  //   ids = marker.pluck(:id) & scene.pluck(:id)
  //   where(id: ids.uniq)
  // }

  private performers(ids: Array<Maybe<string>>) {
    // performer_ids = scene_performer_ids.map { |id| id.to_i  }.uniq

    // left_outer_joins(scene: [:performers])
    //   .where(scene: {performers: {id: performer_ids}})
    //   .distinct
  }
}
