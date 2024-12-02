import { DEFAULT_SETTINGS, ManagerSettings, ManagerSettingTab} from './settings'
import { ExampleView, VIEW_TYPE_EXAMPLE } from './ui/view';
import { Plugin, WorkspaceLeaf } from 'obsidian'
import { ManagerDatabase } from './database'
import { BindParams } from 'sql.js'

export default class ManagerPlugin extends Plugin {
    settings: ManagerSettings
    database: ManagerDatabase
    
    async onload () {
        await this.loadSettings()
        this.database = new ManagerDatabase(this)
        
        this.registerView(
            VIEW_TYPE_EXAMPLE,
            (leaf) => new ExampleView(leaf, this.database)
        );
        
        this.addRibbonIcon('dice', 'Activate view', () => {
            this.activateView();
        });
        
        this.addSettingTab(new ManagerSettingTab(this.app, this));
    }
    
    async loadSettings () {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
    }
    
    async saveSettings () {
        await this.saveData(this.settings)
    }
    
    async query (sql: string, params?: BindParams) {
        return this.db.query(sql, params)
    }

    async activateView() {
        const { workspace } = this.app;

        let leaf: WorkspaceLeaf | null = null;
        const leaves = workspace.getLeavesOfType(VIEW_TYPE_EXAMPLE);

        if (leaves.length > 0) {
          leaf = leaves[0];
        } else {
          leaf = workspace.getRightLeaf(false);
          await leaf.setViewState({ type: VIEW_TYPE_EXAMPLE, active: true });
        }

        workspace.revealLeaf(leaf);
    }
}
