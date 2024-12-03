import initSqlJs, { BindParams, Database } from 'sql.js'
import ManagerPlugin from '../main'
import { App } from 'obsidian'
import * as methods from './methods'
import * as accounts from './account'

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
            const db = await this.app.vault.adapter.readBinary(this.pluginFile(file))
            this.db = new SQL.Database(Buffer.from(db))
        } catch (e) {
            const error = new Error(e)
            return error
        }
    }
  
    async query (sql: string, params?: BindParams) {
        console.log('ManagerDatabase', this)
        return this.db.exec(sql, params)
    }
}

Object.entries(accounts).forEach(([name, account]) => {
    ManagerDatabase.prototype[name] = account
})

Object.entries(methods).forEach(([name, method]) => {
    ManagerDatabase.prototype[name] = method 
})

type Accounts = typeof accounts;
declare module './database' {
    interface ManagerDatabase extends Accounts {
    }
}

type Methods = typeof methods;
declare module './database' {
    interface ManagerDatabase extends Methods{
    }
}
