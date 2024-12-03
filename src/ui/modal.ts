import { App, Modal, Setting } from 'obsidian';
import { ManangerDatabase } from '../database';

export class EditModal extends Modal {
	constructor(app: App, database: ManangerDatabase, transaction) {
		super(app);

		new Setting(this.contentEl)
			.addDropdown((d) =>
				d
				.addOption(transaction.from_account, transaction.from_account)
			)
			.setName("From Account")

		new Setting(this.contentEl)
			.addButton((btn) =>
				btn
				.setButtonText('Submit')
				.setCta()
				.onClick(() => {
					this.close();
					onSubmit(name);
				}));
	}
}
