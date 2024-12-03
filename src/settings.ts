import { App, Notice, PluginSettingTab, Setting } from 'obsidian'
import { VIEW_TYPE_EXAMPLE } from './ui/view';
import ManagerPlugin from './main'

export interface ManagerSettings {
}

export const DEFAULT_SETTINGS: ManagerSettings = {
    databasePath: '',
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
        new Setting(containerEl)
            .setName('Database')
            .setDesc('Database file path')
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
    }
}
