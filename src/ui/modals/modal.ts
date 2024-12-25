import { App, Modal, Notice } from 'obsidian';
import { ManagerDatabase } from '../../database';
import { ManagerAPIDatabase } from '../../api';

export function isEmpty(value: string) { 
	value = value.trim()
	if (value == '') return NaN 
	return value 
}

export class EditModal extends Modal {
	app: App
	database: ManagerDatabase | ManagerAPIDatabase
	callback: (arg: any) => void
	onCloseCallback: (transaction: any) => void
	data: any

	constructor(
		app: App,
		database: ManagerDatabase | ManagerAPIDatabase,
		callback: (arg: any) => void,
        onCloseCallback: (transaction: any) => void,
	) {
		super(app);
        this.app = app;
        this.database = database;
        this.callback = callback;
        this.onCloseCallback = onCloseCallback;
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

	async load(arg: any) {
		this.callback(arg)
	}

    onClose() {
        const { contentEl, data } = this
		if (data)
			this.onCloseCallback(data)
        contentEl.empty()
    }
}
