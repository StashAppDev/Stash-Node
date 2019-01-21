



### Old Queries

```
select distinct `scene_markers`.* from `scene_markers`
left join `tags` as `primary_tags_join` on `primary_tags_join`.`id` = `scene_markers`.`primary_tag_id`
left join `scene_markers_tags` as `tags_join` on `tags_join`.`scene_marker_id` = `scene_markers`.`id`
where `primary_tags_join`.`id` in (55) AND `tags_join`.`tag_id` in (3)
group by `scene_markers`.`id`
```