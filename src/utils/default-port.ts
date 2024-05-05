import { Dialects } from "../database"

export function getDefaultPort(dialect: Dialects) {
  switch (dialect) {
    case "mysql":
      return 3306
    case "postgres":
      return 5432
    case "sqlite":
      return 0
    default:
      return 0
  }
}
