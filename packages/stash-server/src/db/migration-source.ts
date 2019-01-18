import * as InitialSchema from "./migrations/1_initial_schema";

/**
 * A custom migration source (https://knexjs.org/#Migrations-latest) which is used to ensure the same database
 * can be used for production and development.  The migration file names minus the extension are used as the migration
 * names.  This avoids problems with .ts vs .js in the migration name.
 */
export class StashMigrationSource {
  // Must return a Promise containing a list of migrations.
  // Migrations can be whatever you want, they will be passed as arguments to getMigrationName and getMigration
  public getMigrations() {
    return Promise.resolve([
      "1_initial_schema",
    ]);
  }

  public getMigrationName(migration: string) {
    return migration;
  }

  public getMigration(migration: string) {
    switch (migration) {
      case "1_initial_schema": return InitialSchema;
    }

    throw new Error("Invalid migration");
  }
}
