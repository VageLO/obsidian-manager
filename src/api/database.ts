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

	validate(detail: any, fields: any) {
		const map = new Map()

		detail.forEach((item: any) => {
			new Notice(item.msg, 5000)

			item.loc.forEach((item: any) => {
				if (item == 'body')
					return	
				if (!map.has(item))
					map.set(item, item)
			})
		})

		for (const [key, value] of Object.entries(fields)) {
			if (!map.has(key) && value.classList.contains('invalid-input'))
				value.classList.remove('invalid-input')
			else if (map.has(key))
				value.classList.add('invalid-input')
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
