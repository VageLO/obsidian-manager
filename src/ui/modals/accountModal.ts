import { Setting, Notice } from 'obsidian';
import { EditModal, isEmpty } from './modal';
import { isString } from 'util';
import { Account } from 'types';

export async function accountModal(this: EditModal) {

	const accounts = await this.database.listAccounts()

	const account: Account = {
		id: null,
		title: null,
		currency: null,
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
				.onChange((v) => {
					const value: number = Number(v);
					(title.components[0] as any).setValue(accounts[value].title)
					(currency.components[0] as any).setValue(accounts[value].currency)
					(balance.components[0] as any).setValue(accounts[value].balance.toString())
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
						delete: await this.database.deleteAccount(account.id as number)
					}
					this.close()
				})
		})

	const title = new Setting(this.contentEl)
		.setName("Title")
		.addText((text) => {
			text
				.onChange((value) => {
					const title = isEmpty(value)
					if (!isString(title)) {
						new Notice("Can't be empty")
						account.title = null; 
						return
					}
					account.title = title; 
				})
		})

	const currency = new Setting(this.contentEl)
		.setName("Currency")
		.addText((text) => {
			text
				.onChange((value) => {
					const currency = isEmpty(value)
					if (!isString(currency)) {
						new Notice("Can't be empty")
						account.currency = null; 
						return
					}
					account.currency = currency; 
				})
		})

	const balance = new Setting(this.contentEl)
		.setName("Balance")
		.addText((text) => {
			text
                .setValue(account.balance.toString())
				.onChange((value) => {
					const fixed_balance: string = Number.parseFloat(value).toFixed(2)
					const balance: number = Number(fixed_balance)	
					if (isNaN(balance)) {
						new Notice("Please specify valid number")
						return
					}
					account.balance = balance; 
				})
		})

	new Setting(this.contentEl)
		.addButton((btn) =>
			btn
			.setButtonText('💾')
			.setCta()
			.onClick(async() => {
				let res
				const fields = {
					title: (title.components[0] as any)?.inputEl,
					currency: (currency.components[0] as any)?.inputEl,
					balance: (balance.components[0] as any)?.inputEl,
				}
				if (account.id) {
					res = await this.database.updateAccount(account)
					if ('error' in res) {
						this.validate(res.detail, fields)
						return
					}
					this.data = { update: res }
				} else {
					res = await this.database.createAccount(account)
					if ('error' in res) {
						this.validate(res.detail, fields)
						return
					}
					this.data = res
				}
				this.close();
			}));
}
