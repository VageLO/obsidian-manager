import ManagerPlugin from '../main'
import { App } from 'obsidian'
import * as requests from './requests'

export class ManagerAPIDatabase {
	plugin: ManagerPlugin
	app: App

	constructor (plugin: ManagerPlugin) {
		this.plugin = plugin
		this.app = plugin.app
		this.apiURL = 'http://localhost:8000/api/manager'
		this.project = plugin.settings.apiProject
	}

	async checkAPI() {
		const url = `${this.apiURL}/docs`
		const request: RequestUrlParam = {
			url: url,
			method: "GET",
		}
		try {
			const res = await requestUrl(request)
		}
		catch(e) {
			return new Error(`${this.apiURL} ${e.message}`)
		}
	}
}

Object.entries(requests).forEach(([name, method]) => {
	ManagerAPIDatabase.prototype[name] = method 
})

type Requests = typeof requests;
declare module './database' {
	interface ManagerAPIDatabase extends Requests {
	}
}
