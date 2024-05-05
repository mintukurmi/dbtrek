import { CliOptions } from "../"

export function validateOptions(options: CliOptions) {
  let direction: string | null = null

  if (!options) {
    throw new Error("No options provided")
  }

  if (!("path" in options)) {
    throw new Error("Please provide path to migrations")
  }

  if (!("dialect" in options)) {
    throw new Error("Please provide a dialect")
  }

  if (validateDirection(options) > 1) {
    throw new Error("You can only provide one direction")
  }

  if (options.latest) {
    direction = "latest"
  }

  if (options.up) {
    direction = "up"
  }

  if (options.down) {
    direction = "down"
  }
  if (options.noMigrations) {
    direction = "NO_MIGRATIONS"
  }

  if (options.migrateTo) {
    direction = options.migrateTo
  }

  return {
    dialect: options.dialect,
    direction: direction,
    path: options.path,
  }
}

function validateDirection(options: CliOptions) {
  let count = 0

  if (options.up) count++

  if (options.down) count++

  if (options.latest) count++

  if (options.noMigrations) count++

  if (options.migrateTo) count++

  return count
}
