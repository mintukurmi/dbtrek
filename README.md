## DBTrek

DBTrek is a light-weight and easy-to-use CLI based database migration tool written on top of [Kysley](https://kysely.dev/).

[Kysley](https://kysely.dev/) simplifies SQL query building in TypeScript, offering type safety and ease of use. DBTrek leverages Kysely, facilitating effortless migration creation and synchronization with databases through intuitive CLI commands. Under the hood, DBTrek uses Kysely migrator to run all the migration.

## Usage Commands

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

## How to use?

To add a new migration

`dbtrek add --path="./src/migrations"` (When prompted enter a name for the migration)

To run database migrations

`dbtrek migrate --dialect="mysql" --path="./dist/migrations"`

Note that:

- Here `--path=<path>` is the path from the context of the current folder.
- By default `direction` is set to `--latest`, alternatively you can pass others like `--latest`, `--up`, `--down`

Possible values for directions are:

- `--latest`: Runs all migrations that have not yet been run
- `--up`: Migrate one step up
- `--down`: Migrate one step down
- `--migrateTo=<migration_name>`: Migrates up/down upto the provided -migration.
- `--noMigrations`: Undo all the migration that has run so far
