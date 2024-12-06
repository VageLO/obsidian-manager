import { App, Modal, Setting, Notice } from 'obsidian';
import { ManagerDatabase } from '../database';

export class EditModal extends Modal {
	constructor(
		app: App,
		database: ManagerDatabase,
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
		await this.callback(arg)
	}

    onClose() {
        const { contentEl, transaction } = this
        this.onCloseCallback(transaction)
        contentEl.empty()
    }
}
