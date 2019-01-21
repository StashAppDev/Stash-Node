import Knex from "knex";

function id(table: Knex.CreateTableBuilder) {
  table.increments("id").notNullable().primary();
}

function timestamp(table: Knex.CreateTableBuilder) {
  table.dateTime("created_at").notNullable();
  table.dateTime("updated_at").notNullable();
}

exports.up = (knex: Knex) => {
  const builder = knex.schema;

  builder.createTable("galleries", (table) => {
    id(table);
    table.string("path", 510).notNullable().unique();
    table.string("checksum").notNullable().unique();
    table.integer("scene_id").references("scenes.id").onDelete("SET NULL");
    timestamp(table);

    table.index(["scene_id"], "index_galleries_on_scene_id");
  });

  builder.createTable("performers", (table) => {
    id(table);
    table.binary("image").notNullable();
    table.string("checksum").notNullable().unique();
    table.string("name");
    table.string("url");
    table.string("twitter");
    table.string("instagram");
    table.date("birthdate");
    table.string("ethnicity");
    table.string("country");
    table.string("eye_color");
    table.string("height");
    table.string("measurements");
    table.string("fake_tits");
    table.string("career_length");
    table.string("tattoos");
    table.string("piercings");
    table.string("aliases");
    table.boolean("favorite").notNullable().defaultTo(false);
    timestamp(table);

    table.index(["checksum"], "index_performers_on_checksum");
    table.index(["name"], "index_performers_on_name");
  });

  builder.createTable("scene_markers", (table) => {
    id(table);
    table.string("title").notNullable();
    table.decimal("seconds").notNullable();
    table.integer("primary_tag_id").references("tags.id");
    table.integer("scene_id").references("scenes.id").onDelete("CASCADE");
    timestamp(table);

    table.index(["primary_tag_id"], "index_scene_markers_on_primary_tag_id");
    table.index(["scene_id"], "index_scene_markers_on_scene_id");
  });

  builder.createTable("scenes", (table) => {
    id(table);
    table.string("path", 510).notNullable().unique();
    table.string("checksum").notNullable().unique();
    table.string("title");
    table.text("details");
    table.string("url");
    table.date("date");
    table.integer("rating");
    table.string("size");
    table.decimal("duration", 7, 2);
    table.string("video_codec");
    table.string("audio_codec");
    table.integer("width");
    table.integer("height");
    table.decimal("framerate", 7, 2);
    table.integer("bitrate");
    table.integer("studio_id").references("studios.id").onDelete("SET NULL");
    timestamp(table);

    table.index(["studio_id"], "index_scenes_on_studio_id");
  });

  builder.createTable("scraped_items", (table) => {
    id(table);
    table.string("title");
    table.text("description");
    table.string("url");
    table.date("date");
    table.string("rating");
    table.string("tags", 510);
    table.string("models", 510);
    table.integer("episode");
    table.string("gallery_filename");
    table.string("gallery_url", 510);
    table.string("video_filename");
    table.string("video_url");
    table.integer("studio_id").references("studios.id").onDelete("SET NULL");
    timestamp(table);

    table.index(["studio_id"], "index_scraped_items_on_studio_id");
  });

  builder.createTable("studios", (table) => {
    id(table);
    table.binary("image").notNullable();
    table.string("checksum").notNullable().unique();
    table.string("name");
    table.string("url");
    timestamp(table);

    table.index(["checksum"], "index_studios_on_checksum");
    table.index(["name"], "index_studios_on_name");
  });

  builder.createTable("tags", (table) => {
    id(table);
    table.string("name");
    timestamp(table);

    table.index(["name"], "index_tags_on_name");
  });

  //
  // Join Tables
  //

  builder.createTable("performers_scenes", (table) => {
    table.integer("performer_id").references("performers.id").onDelete("CASCADE");
    table.integer("scene_id").references("scenes.id").onDelete("CASCADE");
    // timestamp(table);

    table.index(["performer_id"], "index_performers_scenes_on_performer_id");
    table.index(["scene_id"], "index_performers_scenes_on_scene_id");
  });

  builder.createTable("scene_markers_tags", (table) => {
    table.integer("scene_marker_id").references("scene_markers.id").onDelete("CASCADE");
    table.integer("tag_id").references("tags.id").onDelete("CASCADE");
    // timestamp(table);

    table.index(["scene_marker_id"], "index_scene_markers_tags_on_scene_marker_id");
    table.index(["tag_id"], "index_scene_markers_tags_on_tag_id");
  });

  builder.createTable("scenes_tags", (table) => {
    table.integer("scene_id").references("scenes.id").onDelete("CASCADE");
    table.integer("tag_id").references("tags.id").onDelete("CASCADE");
    // timestamp(table);

    table.index(["scene_id"], "index_scenes_tags_on_scene_id");
    table.index(["tag_id"], "index_scenes_tags_on_tag_id");
  });

  return builder;
};

exports.down = (knex: Knex) => {
  return knex.schema
    .dropTableIfExists("galleries")
    .dropTableIfExists("performers")
    .dropTableIfExists("scene_markers")
    .dropTableIfExists("scenes")
    .dropTableIfExists("scraped_items")
    .dropTableIfExists("studios")
    .dropTableIfExists("tags")
    .dropTableIfExists("performers_scenes")
    .dropTableIfExists("scene_markers_tags")
    .dropTableIfExists("scenes_tags");
};
