import ManagerPlugin from '../main'
import { App, RequestUrlParam, Notice, requestUrl } from 'obsidian'
import * as requests from './requests'

export class ManagerAPIDatabase {
	plugin: ManagerPlugin
	app: App
	apiURL: string
	project: string

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
			await requestUrl(request)
		}
		catch(e) {
			return new Error(`${this.apiURL} ${e.message}`)
		}
	}

	validateError(details: any, query: string){
		details.forEach((detail: any) => {
			const error = `URL: ${query}\nMessage: ${detail.msg}\nloc: ${detail.loc.join(',')}`
			new Notice(error)
		})
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
