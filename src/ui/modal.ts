import { App, Modal, Setting, Notice } from 'obsidian';
import { ManagerDatabase } from '../database';

export class EditModal extends Modal {
	constructor(
		app: App,
		database: ManagerDatabase,
		callback: (arg: any) => void,
	) {
		super(app);
        this.app = app;
        this.database = database;
        this.callback = callback;
	}

	async load(arg: any) {
		await this.callback(arg)
	}
}
