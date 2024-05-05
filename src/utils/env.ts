/**
 * Retrieves the value of the specified environment variable. If the variable is not set, it logs a message and uses the default value if provided. If no default value is provided, it throws an error.
 *
 * @param {string} key - The name of the environment variable to retrieve.
 * @param {string} defaultvalue - The default value to use if the environment variable is not set.
 * @return {string} The value of the environment variable or the default value if provided.
 */
export function getEnv(key: string, defaultvalue?: string) {
  if (process.env[key]) return process.env[key] ?? ""
  console.log(`env ${key} not set. Using default value ${defaultvalue}`)

  if (defaultvalue) return defaultvalue
  throw new Error(`env ${key} not set`)
}
