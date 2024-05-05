import { MysqlDialect, PostgresDialect, SqliteDialect } from "kysely"
import { createPool, PoolOptions } from "mysql2"
import { Pool, PoolConfig } from "pg"
import SQLite from "better-sqlite3"

export interface DatabaseConfig {
  filename?: string
  host?: string
  port?: number
  database?: string
  user?: string
  password?: string
}

export type Dialects = "postgres" | "mysql" | "sqlite"

/**
 * Get the corresponding database dialect for the given input dialect.
 *
 * @param {string} dialect - The input database dialect
 * @return {string} The corresponding database dialect
 */
export function getDatabaseDialect(dialect: Dialects, config: DatabaseConfig) {
  const { filename, ...poolConfig } = config

  switch (dialect) {
    case "postgres":
      return getPostgresDialect(poolConfig)
    case "mysql":
      return getMysqlDialect(poolConfig)
    case "sqlite":
      return getSqliteDialect(filename ?? "", {
        fileMustExist: true,
      })
    default:
      throw new Error(`Unknown database dialect: ${dialect}`)
  }
}

/**
 * Function to get the Postgres dialect based on the provided configuration.
 * @param {PoolConfig} config - the configuration for the pool
 * @return {PostgresDialect} a new instance of PostgresDialect
 */
export function getPostgresDialect(config: PoolConfig) {
  return new PostgresDialect({
    pool: new Pool(config),
  })
}

/**
 * Function to get MySQL dialect based on the provided configuration.
 * @param {PoolOptions} config - The configuration options for the pool.
 * @return {MysqlDialect} The MySQL dialect instance.
 */
export function getMysqlDialect(config: PoolOptions) {
  return new MysqlDialect({
    pool: createPool(config),
  })
}

/**
 * Function to get SQLite dialect based on the provided configuration.
 * @param {PoolOptions} config - The configuration options for the pool.
 * @return {MysqlDialect} The MySQL dialect instance.
 */
export function getSqliteDialect(filename: string, config: SQLite.Options) {
  if (!filename) {
    throw new Error("No filename provided")
  }

  return new SqliteDialect({
    database: new SQLite(filename, config),
  })
}
