import { FileMigrationProvider, Migrator, MigrationResultSet, Kysely, NO_MIGRATIONS } from "kysely"
import fs from "fs/promises"
import * as path from "path"

export interface IDBTrekMigrator {
  migrateToLatest: () => Promise<void>
  migrateDown(): Promise<void>
  migrateUp(): Promise<void>
  migrateTo(migrationName: string | "NO_MIGRATIONS"): Promise<void>
}

export class DBTrekMigrator implements IDBTrekMigrator {
  private migrator: Migrator

  constructor(db: Kysely<any>, migrationFolder: string) {
    this.migrator = new Migrator({
      db,
      provider: new FileMigrationProvider({
        fs,
        migrationFolder: path.join(process.cwd(), migrationFolder),
        path: path,
      }),
      allowUnorderedMigrations: false,
    })
  }

  /**
   * This method synchronizes the database to the latest migrations
   *
   * @return {Promise<void>} undefined
   */
  async migrateToLatest(): Promise<void> {
    const res = await this.migrator.migrateToLatest()
    this.migrationValidator(res)
  }

  /**
   * This method performs a migration down operation.
   *
   * @return {Promise<void>} A promise that resolves when the migration down operation is complete
   */
  async migrateDown(): Promise<void> {
    const res = await this.migrator.migrateDown()
    this.migrationValidator(res)
  }

  /**
   * This method performs a migration up operation.
   *
   * @return {Promise<void>} A promise that resolves when the migration up operation is complete
   */
  async migrateUp(): Promise<void> {
    const res = await this.migrator.migrateUp()
    this.migrationValidator(res)
  }

  /**
   * This method migrates to the specified migration.
   * @param {string | "NO_MIGRATIONS"} migrationName - The name of the migration to migrate to.
   * @return {Promise<void>} A Promise that resolves once the migration is completed.
   */
  async migrateTo(migrationName: string | "NO_MIGRATIONS"): Promise<void> {
    let res = null

    if (migrationName != "NO_MIGRATIONS") res = await this.migrator.migrateTo(migrationName)
    else res = await this.migrator.migrateTo(NO_MIGRATIONS)

    this.migrationValidator(res)
  }

  /**
   * A method to validate migration results and handle errors.
   *
   * @param {MigrationResultSet} results - the migration results to validate
   */
  private migrationValidator({ results, error }: MigrationResultSet) {
    results?.forEach((it) => {
      if (it.status === "Success") {
        console.log(`✅ migration "${it.migrationName}" was executed successfully`)
      } else if (it.status === "Error") {
        console.error(`❌ Failed to execute migration "${it.migrationName}"`)
      }
    })

    if (error) {
      console.error("❌ failed to migrate")
      console.error(error)
      process.exit(1)
    }

    if (results?.length == 0) {
      console.log("✅ Database already in sync \n")
    }
  }
}
