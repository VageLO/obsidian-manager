import { DEFAULT_SETTINGS, ManagerSettings, ManagerSettingTab} from './settings'
import { ManagerView, VIEW_TYPE } from './ui/view';
import { Plugin, WorkspaceLeaf, addIcon, Notice } from 'obsidian'
import { ManagerDatabase } from './database'
import { BindParams } from 'sql.js'

export default class ManagerPlugin extends Plugin {
    plugin: Plugin
    settings: ManagerSettings
    database: ManagerDatabase
    
    async onload () {
        await this.loadSettings()
        this.addSettingTab(new ManagerSettingTab(this.app, this));

        const err = await this.loadDatabase()
        if (err instanceof Error)
            new Notice(`Error: ${err.message}`)

        this.registerView(
            VIEW_TYPE,
            (leaf) => new ManagerView(leaf, this.database)
        );

        const ribbon = require('./icons.json').ribbon
        addIcon('dollar', ribbon);
        this.addRibbonIcon('dollar', 'Money Manager', async() => {

            const err = await this.loadDatabase()
            if (err instanceof Error) {
                new Notice(`Error: ${err.message}`)
                return
            }

            this.activateView();
        });
    }
    
    async loadDatabase() {
        this.database = new ManagerDatabase(this)
        return await this.database.initDatabase()
    }
 
    async loadSettings () {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
    }
    
    async saveSettings () {
        await this.saveData(this.settings)
    }
    
    async query (sql: string, params?: BindParams) {
        return this.database.query(sql, params)
    }

    async activateView() {
        const { workspace } = this.app;

        let leaf: WorkspaceLeaf | null = null;
        const leaves = workspace.getLeavesOfType(VIEW_TYPE);

        if (leaves.length > 0) {
            leaf = leaves[0];
            leaf.rebuildView();
        } else {
            leaf = workspace.getRightLeaf(false);
            await leaf.setViewState({ type: VIEW_TYPE, active: true });
        }

        workspace.revealLeaf(leaf);
    }
}
