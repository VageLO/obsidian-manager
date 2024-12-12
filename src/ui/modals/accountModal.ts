import { Setting, Notice } from 'obsidian';
import { EditModal } from './modal';

export async function createAccount(this: EditModal) {

	const accounts = await this.database.listAccounts()

	interface Account {
		id: number | null;
		title: string;
		currency: string;
		balance: number;
	}
	const account: Account = {
		id: null,
		title: '',
		currency: '',
		balance: 0,
	}

	new Setting(this.contentEl)
		.setName("Manage Accounts")
		.addDropdown((d) => {
			accounts.forEach((item: any, idx: number) => {
				d.addOption(idx.toString(), item.title)
			})
			d
				.setValue('')
				.onChange((value) => {
					title.components[0].setValue(accounts[value].title)
					currency.components[0].setValue(accounts[value].currency)
					balance.components[0].setValue(accounts[value].balance.toString())
					account.id = accounts[value].id; 
					account.title = accounts[value].title; 
					account.currency = accounts[value].currency; 
					account.balance = accounts[value].balance; 
				})
		})
		.addButton((button) => {
			button
				.setButtonText("Delete")
				.onClick(async() => {
					this.data = {
						delete: await this.database.deleteAccount(account.id)
					}
					this.close()
				})
		})

	const title = new Setting(this.contentEl)
		.setName("Title")
		.addText((text) => {
			text
				.onChange((value) => {
					account.title = value.trim(); 
				})
		})

	const currency = new Setting(this.contentEl)
		.setName("Currency")
		.addText((text) => {
			text
				.onChange((value) => {
					account.currency = value.trim(); 
				})
		})

	const balance = new Setting(this.contentEl)
		.setName("Balance")
		.addText((text) => {
			text
                .setValue(account.balance.toString())
				.onChange((value) => {
					if (Number.isNaN(+value)) {
						new Notice("Please specify valid number")
						return
					}
					account.balance = +value; 
				})
		})

	new Setting(this.contentEl)
		.addButton((btn) =>
			btn
			.setButtonText('💾')
			.setCta()
			.onClick(async() => {
				if (account.id)
					this.data = { update: await this.database.updateAccount(account) }
				else
					this.data = await this.database.createAccount(account)

				this.close();
			}));
}
