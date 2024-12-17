import { App, Modal } from 'obsidian';
import { ManagerDatabase } from '../../database';
import { ManagerAPIDatabase } from '../../api';

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

	async load(arg: any) {
		this.callback(arg)
	}

	// TODO: Validation for local database
	validate(detail: any, fields: any) {
		detail.forEach((item: any) => {
			item.loc.forEach((loc: any) => {
				if (!fields.hasOwnProperty(loc))
					return
				fields[loc].classList.add('invalid-input')
			})
		})
	}

    onClose() {
        const { contentEl, data } = this
		if (data)
			this.onCloseCallback(data)
        contentEl.empty()
    }
}
