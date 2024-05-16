#!/usr/bin/env node

import "dotenv/config"
import { Kysely, ParseJSONResultsPlugin } from "kysely"
import minimist from "minimist"
import { createInterface } from "readline"
import { Dialects, getDatabaseDialect } from "./database"
import { DBTrekMigrator } from "./migrator"
import { getEnv } from "./utils/env"
import { createFile } from "./utils/file-writer"
import { validateOptions } from "./utils/options-validator"
import { getDefaultPort } from "./utils/default-port"

export interface CliOptions {
  _: Array<string>
  dialect?: Dialects
  latest?: boolean
  up?: boolean
  down?: boolean
  migrateTo?: string
  noMigrations?: boolean
  path: string
  help?: boolean
  h?: boolean
  version?: boolean
  v?: boolean
}

export async function run(options: CliOptions) {
  const cmd = options._

  // displays usage information
  if (options.help || options.h) {
    displayHelp()
    return
  }

  // displays currrent version
  if (options.version || options.v) {
    console.log("dbtrek version", getVersion())
    return
  }

  // check is no commadn is provided
  if (cmd.length === 0) {
    throw new Error("No command provided")
  }

  // Adds a new migration file
  if (cmd.includes("add")) {
    if (!("path" in options)) throw new Error("Please provide path to add migrations")

    const readline = createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    // add file to disk
    readline.question("Provide a name for migration: ", (name: string) => {
      const filename = createFile(options?.path, name)
      console.log("File added: ", filename)
      readline.close()
    })

    return
  }

  // Migrates the database
  else if (cmd.includes("migrate")) {
    // validates the options
    const validatedOptions = validateOptions(options)
    const direction = validatedOptions.direction ?? "latest"
    const defaultPort = getDefaultPort(validatedOptions.dialect as Dialects)

    const dialect = getDatabaseDialect(options.dialect?.toLowerCase() as Dialects, {
      filename: process.env["SQLITE_FILENAME"],
      host: getEnv("DATABASE_HOST", "localhost"),
      database: getEnv("DATABASE_NAME"),
      user: getEnv("DATABASE_USER"),
      password: getEnv("DATABASE_PASSWORD"),
      port: parseInt(getEnv("DATABASE_PORT", defaultPort + "")),
    })

    const db = new Kysely<any>({
      dialect,
      plugins: [new ParseJSONResultsPlugin()],
    })

    const migrator = new DBTrekMigrator(db, options.path)
    if (direction === "latest") await migrator.migrateToLatest()
    else if (direction === "down") await migrator.migrateDown()
    else if (direction === "up") await migrator.migrateUp()
    else await migrator.migrateTo(direction)

    await db.destroy()
  } else {
    throw new Error("Unknown command")
  }
}

export function displayHelp() {
  console.log(`
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
  `)
}

export function getVersion() {
  return require("../package.json").version
}

;(async () => {
  try {
    const argv = minimist(process.argv.slice(2)) as CliOptions
    await run(argv)
  } catch (err: any) {
    console.log(err)
  }
})()
