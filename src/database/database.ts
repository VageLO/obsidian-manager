import initSqlJs, { BindParams, Database } from 'sql.js'
import ManagerPlugin from '../main'
import { App } from 'obsidian'
import * as methods from './methods'

export class ManagerDatabase {
    plugin: ManagerPlugin
    app: App
    db: Database
  
	constructor (plugin: ManagerPlugin) {
		this.plugin = plugin
		this.app = plugin.app
	}
  
	async initDatabase () {
		const SQL = await initSqlJs({
			locateFile: _file => this.pluginFile('sql-wasm.wasm', true),
		})

		const file = this.plugin.settings.databasePath
		if (file == '') {
			const error = new Error('Set database file path in settings')
			return error
		}

		try {
			const db = await this.app.vault.adapter.readBinary(this.plugin.settings.databasePath)
			this.db = new SQL.Database(Buffer.from(db))
			this.db.run("PRAGMA foreign_keys = ON;");
		} catch (e) {
			const error = new Error(e)
			return error
		}
	}

	validateError(str_error: string) {
		const splits = str_error.split('.')
		return [{
			loc: splits,
			msg: str_error,
		}]
	}

	async query (sql: string, params?: BindParams) {
		return this.db.exec(sql, params)
	}
}

Object.entries(methods).forEach(([name, method]) => {
    ManagerDatabase.prototype[name] = method 
})

type Methods = typeof methods;
declare module './database' {
    interface ManagerDatabase extends Methods{
    }
}
