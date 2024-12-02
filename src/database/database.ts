import initSqlJs, { BindParams, Database } from 'sql.js'
import ManagerPlugin from '../main'
import { App, Notice } from 'obsidian'
import * as methods from './methods'
import * as accounts from './account'

export class ManagerDatabase {
    plugin: ManagerPlugin
    app: App
    db: Database
  
    constructor (plugin: ManagerPlugin) {
        this.plugin = plugin
        this.app = plugin.app

        this.initDatabase()
    }
  
    async initDatabase () {
        const SQL = await initSqlJs({
            locateFile: _file => this.pluginFile('sql-wasm.wasm', true),
        })
        
        const file = this.plugin.settings.databasePath
        if (file == '') {
            new Notice('Set database file path in settings')
            return
        }

        try {
            const db = await this.app.vault.adapter.readBinary(this.pluginFile(file))
            this.db = new SQL.Database(Buffer.from(db))
        } catch (e) {
            new Notice(e)
        }
    }
  
    pluginFile (filename: string, absolute = false) {
        const thisPluginId = require('../../manifest.json').id
        const path = [
            this.app.vault.configDir,
            'plugins',
            thisPluginId,
            filename
        ]
        if (absolute) path.unshift(this.app.vault.adapter.basePath)
            return path.join('/')
    }

    async query (sql: string, params?: BindParams) {
        return this.db.exec(sql, params)
    }
}

Object.entries(accounts).forEach(([name, account]) => {
    ManagerDatabase.prototype[name] = account
})

type Accounts = typeof accounts;
declare module './database' {
    interface ManagerDatabase extends Accounts {
    }
}
