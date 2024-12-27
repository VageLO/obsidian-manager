import { ManagerDatabase } from '..'

export async function save (this: ManagerDatabase) {
    const data = this.db.export().buffer
    await this.app.vault.adapter.writeBinary(this.plugin.settings.databasePath, data)
	this.db.run("PRAGMA foreign_keys = ON;");
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

export function createObjFromArray(obj: {columns: any[], values: any[]}) : any[] {
	const { columns, values } = obj
	const transactions: any[]  = []

	values.forEach((value) => {
		const obj = columns.reduce((acc, column, index) => {
			const keyParts = column.split('.')
			if (keyParts[1]) {
				acc[keyParts[0]] = acc[keyParts[0]] || {}
				acc[keyParts[0]][keyParts[1]] = value[index]
				if (Object.values(acc[keyParts[0]]).every(value => value == null))
					acc[keyParts[0]] = null
			} else {
				acc[column] = value[index];
			}
			return acc;
		}, {});
		transactions.push(obj)
	})

	return transactions
}
