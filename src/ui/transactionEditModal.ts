import { Setting, Notice } from 'obsidian';
import { EditModal } from './modal';

export async function editTransaction(this: EditModal, transaction) {
	const accounts = await this.database.listAccounts();
	const categories = await this.database.listCategories();

	new Setting(this.contentEl)
		.setName("Date")
		.addText((text) => {
			text
				.setValue(transaction.date)
				.onChange((value) => {
					transaction.date = value; 
				})
		})

	const amount = new Setting(this.contentEl)
	.setName("Amount")
	.addText((text) => {
		text
			.setValue(transaction.amount.toString())
			.onChange((value) => {
				value = +value;
				transaction.amount = value; 
			})
	})

	amount.addText((text) => {
		if (!transaction.to_account_id)
			text.setDisabled(true)
		text
			.setValue(transaction.to_amount ? transaction.to_amount.toString() : "")
			.onChange((value) => {
				value = +value;
				transaction.to_amount = value; 
			})
		text.inputEl.dataset.key = "to_amount"
	})

	amount.addToggle((toggle) => {
		toggle
			.setValue(true)
			.onChange((value) => {
				let field : Setting
				amount.components.forEach((component) => {
					if (!component.inputEl)
						return 
					if (component.inputEl.dataset.key == "to_amount")
						field = component
				})
				value ? field.setDisabled(false) : field.setDisabled(true)
				!value ? transaction.to_amount = 0 : ""
				field.setValue("")
				console.log(transaction)
			})
		if (!transaction.to_account_id)
			toggle.setValue(false)
	})    

	new Setting(this.contentEl)
		.addDropdown((d) => {
			const types = ["Withdrawal", "Deposit", "Transfer"]
			types.forEach((item) => {
				d.addOption(item, item)
			})
			d
				.setValue(transaction.transaction_type)
				.onChange((value) => {
					transaction.transaction_type = value;
				})
		})
		.setName("Transaction Type")

	new Setting(this.contentEl)
		.addDropdown((d) => {
			accounts.forEach((account) => {
				d.addOption(account.id, account.title)
			})
			d
				.setValue(transaction.account_id)
				.onChange((value) => {
					value = +value
					if (value == transaction.to_account_id)
						new Notice('Accounts should be different')
					transaction.account_id = value;
				})
		})
		.setName("From Account")


	if (transaction.to_account_id) {
		new Setting(this.contentEl)
			.addDropdown((d) => {
				accounts.forEach((account) => {
					d.addOption(account.id, account.title)
				})
				d
					.setValue(transaction.to_account_id)
					.onChange((value) => {
						value = +value
						if (value == transaction.account_id)
							new Notice('Accounts should be different')
						transaction.to_account_id = value;
					})
			})
			.setName("To Account")
	}
	new Setting(this.contentEl)
		.addDropdown((d) => {
			categories.forEach((category) => {
				d.addOption(category.id, category.title)
			})
			d
				.setValue(transaction.category_id)
				.onChange((value) => {
					value = +value
					transaction.category_id = value;
				})
		})
		.setName("Category")

	new Setting(this.contentEl)
		.setName("Description")
		.addTextArea((text) => {
			text
				.setValue(transaction.description)
				.onChange((value) => {
					transaction.description = value; 
				})
		})

	new Setting(this.contentEl)
		.addButton((btn) =>
			btn
			.setButtonText('💾')
			.setCta()
			.onClick(() => {
				this.close();
				console.log(transaction)
			}));
}
