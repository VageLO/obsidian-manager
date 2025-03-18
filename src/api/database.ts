import ManagerPlugin from '../main';
import { App, RequestUrlParam, Notice, requestUrl } from 'obsidian';
import { DatabaseInterface, Methods } from '../types';
import * as methods from './requests';

export class ManagerAPIDatabase implements DatabaseInterface {
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

	async initialize(): Promise<void | Error> {
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

Object.entries(methods).forEach(([name, method]) => {
	(ManagerAPIDatabase.prototype as any)[name] = method 
})

declare module './database' {
	interface ManagerAPIDatabase extends Methods {}
}
