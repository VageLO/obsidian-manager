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

    onClose() {
        const { contentEl, data } = this
		if (data)
			this.onCloseCallback(data)
        contentEl.empty()
    }
}
