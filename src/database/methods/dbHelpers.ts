import { QueryExecResult } from 'sql.js'
import { ManagerDatabase } from '..'

/**
 * Returns the value of the first column in the first row for a given sql.js result
 */
export function getSingleValue (result: QueryExecResult[]) {
    return result?.[0]?.values?.[0]?.[0]
}

export async function save (this: ManagerDatabase) {
    const data = this.db.export().buffer
    await this.app.vault.adapter.writeBinary(this.pluginFile(this.plugin.settings.databasePath), data)
}

export function pluginFile (this: ManagerDatabase, filename: string, absolute = false) {
    const thisPluginId = require('../../../manifest.json').id
    const path = [
        this.app.vault.configDir,
        'plugins',
        thisPluginId,
        filename
    ]
    if (absolute) path.unshift(this.app.vault.adapter.basePath)
        return path.join('/')
}
