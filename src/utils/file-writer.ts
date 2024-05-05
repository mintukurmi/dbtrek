import { writeFileSync } from "fs"
import { relative, sep } from "path"

/**
 * Creates a file at the specified path with the given name.
 *
 * @param {string} path - the path where the file will be created
 * @param {string} name - the name of the file
 * @return {string} the path of the created file
 */
export const createFile = (path: string, name: string) => {
  const filePath = `.${sep}${relative(process.cwd(), path)}`
  const filename = `${Date.now()}-${name}`

  const content = `import { Kysely } from 'kysely'\n\nexport async function up(db: Kysely<any>): Promise<void> {
    // Migration code\n}\n\nexport async function down(db: Kysely<any>): Promise<void> {
    // Migration code\n}
    `
  const fullFilePath = filePath + sep + filename + ".ts"
  writeFileSync(fullFilePath, content, "utf8")

  return fullFilePath
}
