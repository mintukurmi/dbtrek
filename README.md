## DBTrek

DBTrek is a light-weight and easy-to-use CLI based database migration tool written on top of [Kysley](https://kysely.dev/).

[Kysley](https://kysely.dev/) simplifies SQL query building in TypeScript, offering type safety and ease of use. DBTrek leverages Kysely, facilitating effortless migration creation and synchronization with databases through intuitive CLI commands. Under the hood, DBTrek uses Kysely migrator to run all the migration.

## Contents

- [Usage Commands](https://github.com/mintukurmi/dbtrek#usage-commands)
- [Installation & Setup](https://github.com/mintukurmi/dbtrek#setup)
- [How to use?](https://github.com/mintukurmi/dbtrek#how-to-use)
- [Migration Examples](https://github.com/mintukurmi/dbtrek#examples)

## [Usage Commands](https://github.com/mintukurmi/dbtrek#usage-commands)

```
Usage: dbtrek <command> [options]

  Commands
    add [options]            Adds a new migration file
    migrate [options]        Migrates the database

  Options
    --path=<path>            Path to migrations
    --dialect=<dialect>      Database dialect  (default: postgres)
    --latest                 Migrate to the latest migration (default)
    --up                     Migrate one step up
    --down                   Migrate one step down
    --migrateTo=<name>       Migrate to a specific migration
    --noMigrations           Migrate down until first migration (undos all migrations)
    --help, -h               Displays this help message
    --version, -v            Displays the version
```

## [Installation & Setup](https://github.com/mintukurmi/dbtrek#setup)

- To install the package, run `npm i dbtrek`.
- A very minimal setup is required for this package to work. Add the proper environment variables into your `.env` file, that's it.

```
  # a working .env file, looks like
  SQLITE_FILENAME="test.db" # (Required only in case of sqlite)
  DATABASE_HOST= "localhost"
  DATABASE_PORT = "5432"
  DATABASE_NAME = "test"
  DATABASE_USER= "postgres"
  DATABASE_PASSWORD = "1234"
```

## [How to use?](https://github.com/mintukurmi/dbtrek#how-to-use)

To add a new migration

`dbtrek add --path="./src/migrations"` (When prompted enter a name for the migration)

To run database migrations

`dbtrek migrate --dialect="mysql" --path="./dist/migrations"`

Note that:

- Here `--path=<path>` is the path from the context of the current folder.
- By default `direction` is set to `--latest`, alternatively you can pass others like `--latest`, `--up`, `--down`.

Possible values for directions are:

- `--latest`: Runs all migrations that have not yet been run
- `--up`: Migrate one step up
- `--down`: Migrate one step down
- `--migrateTo=<migration_name>`: Migrates up/down upto the provided -migration.
- `--noMigrations`: Undo all the migration that has run so far

## [Migration Examples](https://github.com/mintukurmi/dbtrek#examples)

Note that, migrations are written using [Kysley](https://kysely.dev/). An example migration file looks like.

```
    import { Kysely } from "kysely";

    export async function up(db: Kysely<any>): Promise<void> {
      await db.schema
        .createTable("TestDB.pet")
        .addColumn("id", "serial", (col) => col.primaryKey())
        .addColumn("name", "varchar", (col) => col.notNull().unique())
        .addColumn("species", "varchar", (col) => col.notNull())
        .execute();
    }

    export async function down(db: Kysely<any>): Promise<void> {
      await db.schema.dropTable("TestDB.pet").execute();
    }
```

Please refer to [Kysley Docs](https://kysely.dev/docs/migrations), incase you need more help with writing migrations using Kysely.

Happy coding !! :-)
