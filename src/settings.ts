import { App, PluginSettingTab, Setting } from 'obsidian'
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
        const { containerEl } = this
        
        containerEl.empty()
        new Setting(containerEl)
            .setName('Database')
            .setDesc('Database file path')
            .addText((text) =>
              text
                .setValue(this.plugin.settings.databasePath)
                .onChange(async (value) => {
                    this.plugin.settings.databasePath = value;
                    await this.plugin.saveSettings();
                })
            );
    }
}
