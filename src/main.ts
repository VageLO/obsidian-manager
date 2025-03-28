import { DEFAULT_SETTINGS, ManagerSettings, ManagerSettingTab} from './settings'
import { ribbon } from './icons'
import { ManagerView, VIEW_TYPE } from './ui/view';
import { Plugin, WorkspaceLeaf, addIcon, Notice } from 'obsidian'
import { ManagerDatabase } from './database'
import { ManagerAPIDatabase } from './api'
import { DatabaseInterface } from 'types';

export default class ManagerPlugin extends Plugin {
    plugin: Plugin
    settings: ManagerSettings
    database: DatabaseInterface
    
    async onload() {
        await this.loadSettings()
        this.addSettingTab(new ManagerSettingTab(this.app, this));

        const err = await this.detectDatabaseType()
        if (err instanceof Error)
            new Notice(`Error: ${err.message}`)
		else this.notify()

        await this.loadSettings()
        this.registerView(
            VIEW_TYPE,
            (leaf) => new ManagerView(leaf, this.database)
        );

        addIcon('dollar', ribbon);

        this.addRibbonIcon('dollar', 'Money Manager', async() => {

            const err = await this.detectDatabaseType()
            if (err instanceof Error)
                return new Notice(`Error: ${err.message}`)

            await this.activateView();
        });
    }
    
	async notify() {
		const { api, local, databasePath, apiProject } = this.settings
		if (api)
			new Notice(`API ${apiProject} file loaded`)
		else if (local)
			new Notice(`Local ${databasePath} file loaded`)
	}

	async detectDatabaseType() {
		const { api, local } = this.settings

		if (local) {
			return await this.loadLocalDatabase()
		}
		else if (api) {
			this.database = new ManagerAPIDatabase(this)
			return await this.database.initialize()
		}
		else 
			return new Error("Specify database in settings")
	}

    async loadLocalDatabase() {
        this.database = new ManagerDatabase(this)
        return await this.database.initialize()
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
    }
    
    async saveSettings() {
        await this.saveData(this.settings)
    }
    
    async activateView() {
        const { workspace } = this.app;

        let leaf: WorkspaceLeaf | null = null;
        const leaves = workspace.getLeavesOfType(VIEW_TYPE);

        if (leaves.length > 0) {
			const rebuild: any = leaves[0]
            rebuild.rebuildView();
            leaf = leaves[0]
        } else {
            leaf = workspace.getLeaf(false);
            await leaf.setViewState({ type: VIEW_TYPE, active: true });
        }

        workspace.revealLeaf(leaf);
    }

	// TODO: Commands
	registerCommands() {
		this.addCommand({
			id: "add-transaction",
			name: "Add transaction",
			callback: () => {

			},
		});
	}
}
