import { App, Notice, PluginSettingTab, Setting } from 'obsidian'
import ManagerPlugin from './main'

export interface ManagerSettings {
	local: boolean,
	api: boolean,
	databasePath: string,
	apiProject: string,
}

export const DEFAULT_SETTINGS: ManagerSettings = {
	local: false,
	api: false,
    databasePath: '',
    apiProject: '',
}

export class ManagerSettingTab extends PluginSettingTab {
	app: App
    plugin: ManagerPlugin
    
    constructor (app: App, plugin: ManagerPlugin) {
        super(app, plugin)
        this.plugin = plugin
    }
    
    display (): void {
        const { containerEl, plugin, app } = this
        const { adapter }: any = app.vault
        
        containerEl.empty()

        const localdb = new Setting(containerEl)
            .setName('Database')
            .setDesc('Local database file path')
            .addText((text) =>
              text
				.setValue(plugin.settings.databasePath)
				.onChange(async (value) => {
					value = value.trim()

					const localdb_toggle: any = localdb.components[1]
					localdb_toggle.setValue(false)

					plugin.settings.databasePath = value;
					await plugin.saveSettings();
				})
            );

        localdb.addToggle((toggle) => {
		    toggle
		    	.setValue(plugin.settings.local)
                .setTooltip(
                    "Enable local database",
                    {delay: 1, placement: 'left'})
				.setDisabled(plugin.settings.api)
		    	.onChange(async(value) => {
					const apidb_toggle: any = apidb.components[1]
					if (apidb_toggle.on)
						return

					const path = adapter.path.join(adapter.basePath, plugin.settings.databasePath)
					if (adapter.path.extname(path) == '.db' && 
						!adapter.fs.existsSync(path) && value) {
						adapter.fs.writeFile(path, '', (err: any) => {
							if (err)
								new Notice('Error creating file:', err);
							else
								new Notice('File created successfully.');
						});
					}
					else if (!adapter.fs.existsSync(path) && !value)
						return

					if (!value)
						apidb_toggle.setDisabled(value)
					else
						apidb_toggle.setDisabled(value)

					plugin.settings.api = false
					plugin.settings.local = value

					await plugin.saveSettings()
					const err = await plugin.detectDatabaseType()
					if (err instanceof Error)
						new Notice(`Error: ${err.message}`)
					else {
						plugin.notify()
						await plugin.activateView();
					}
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

					const apidb_toggle: any = apidb.components[1]
					apidb_toggle.setValue(false)

					plugin.settings.apiProject = value;
					await plugin.saveSettings()
				})
            );

        apidb.addToggle((toggle) => {
		    toggle
		    	.setValue(plugin.settings.api)
                .setTooltip(
                    "Enable database from api",
                    {delay: 1, placement: 'left'})
				.setDisabled(plugin.settings.local)
		    	.onChange(async(value) => {
					const localdb_toggle: any = localdb.components[1]
					const { apiProject } = plugin.settings

					if (localdb_toggle.on)
						return

					const isNotDbFile = adapter.path.extname(apiProject) != '.db'
					if (isNotDbFile && value) {
						new Notice(`${apiProject} isn't database file`)
						const apidb_toggle: any = localdb.components[1]
						apidb_toggle.setValue(false)
						return
					} else if (isNotDbFile && !value)
						return

					if (!value)
						localdb_toggle.setDisabled(value)
					else
						localdb_toggle.setDisabled(value)

					plugin.settings.local = false;
					plugin.settings.api = value;

					await plugin.saveSettings();
					const err = await plugin.detectDatabaseType()
					if (err instanceof Error)
						new Notice(`Error: ${err.message}`)
					else {
						plugin.notify()
						await plugin.activateView();
					}
                })
        })
    }
}
