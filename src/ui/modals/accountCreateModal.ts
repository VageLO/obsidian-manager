import { Setting, Notice } from 'obsidian';
import { EditModal } from './modal';

export async function createAccount(this: EditModal) {
	interface Account {
		title: string;
		currency: string;
		balance: number;
	}
	const account: Account = {
		title: '',
		currency: '',
		balance: 0,
	}

	new Setting(this.contentEl)
		.setName("Title")
		.addText((text) => {
			text
				.onChange((value) => {
					account.title = value.trim(); 
				})
		})

	new Setting(this.contentEl)
		.setName("Currency")
		.addText((text) => {
			text
				.onChange((value) => {
					account.currency = value.trim(); 
				})
		})

	new Setting(this.contentEl)
		.setName("Balance")
		.addText((text) => {
			text
                .setValue(account.balance.toString())
				.onChange((value) => {
					value = +value
					account.balance = value; 
					if (Number.isNaN(account.balance)) {
						new Notice("Please specify valid number")
					}
				})
		})

	new Setting(this.contentEl)
		.addButton((btn) =>
			btn
			.setButtonText('💾')
			.setCta()
			.onClick(() => {
				this.close();
				console.log(account)
			}));
}
