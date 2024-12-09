import { App, Notice, PluginSettingTab, Setting } from 'obsidian'
import ManagerPlugin from './main'

export interface ManagerSettings {
}

export const DEFAULT_SETTINGS: ManagerSettings = {
    databasePath: '',
    apiProject: '',
}

export class ManagerSettingTab extends PluginSettingTab {
    plugin: ManagerPlugin
    
    constructor (app: App, plugin: ManagerPlugin) {
        super(app, plugin)
        this.plugin = plugin
    }
    
    display (): void {
        const { containerEl, plugin, app } = this
        const { adapter } = app.vault
        
        containerEl.empty()

        const localdb = new Setting(containerEl)
            .setName('Database')
            .setDesc('Local database file path')
            .addText((text) =>
              text
                .setValue(plugin.settings.databasePath)
                .onChange(async (value) => {
                    value = value.trim()
                    const path = adapter.path.join(adapter.basePath, plugin.database.pluginFile(value))
                    if (!adapter.fs.existsSync(path) || value == '')
                        return

                    new Notice(`${value} loaded`)
                    plugin.settings.databasePath = value;
                    await plugin.saveSettings();
                    await plugin.loadDatabase();
                    await plugin.activateView();
                })
            );

        localdb.addToggle((toggle) => {
		    toggle
		    	.setValue(true)
                .setTooltip(
                    "Enable local database",
                    {delay: 1, placement: 'left'})
		    	.onChange((value) => {
                })
        })

        const apidb = new Setting(containerEl)
            .setName('API Database')
            .setDesc('Database file name that will be used from API')
            .addText((text) =>
              text
                .setValue(plugin.settings.apiProject)
                .onChange(async (value) => {
                    value = value.trim()
                    if (value == '')
                        return
                    plugin.settings.apiProject = value;
                })
            );

        apidb.addToggle((toggle) => {
		    toggle
		    	.setValue(true)
                .setTooltip(
                    "Enable database from api",
                    {delay: 1, placement: 'left'})
		    	.onChange((value) => {
                })
        })
    }
}
