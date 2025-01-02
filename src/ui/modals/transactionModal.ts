import { Setting, Notice, BaseComponent } from 'obsidian';
import { ManagerDatabase } from '../../database';
import { EditModal } from './modal';

function parseAmount(amount: string) {
	const num = +Number.parseFloat(amount).toFixed(2);
	if (num < 0) return NaN
	else return num
}

export async function transactionModal(this: EditModal, selected_transaction: any) {
	const accounts = await this.database.listAccounts();
	const categories = await this.database.listCategories();
	const tags = await this.database.listTags();

	interface Transaction {
		account_id: number | null;
		category_id: number | null;
		to_account_id: number | null;
		tag_id: number | null;
		amount: number | null;
		to_amount: number | null;
		transaction_type: string;
		date: string;
		description: string;
	}

	let transaction: Transaction = {
		account_id: null,
		category_id: null,
		to_account_id: null,
		tag_id: null,
		amount: 0,
		to_amount: 0,
		transaction_type: "Withdrawal",
		date: new Date().toISOString().split("T")[0],
		description: "",
	}

    if (selected_transaction)
        transaction = {...selected_transaction}

	const date = new Setting(this.contentEl)
		.setName("Date")
		.addText((text) => {
			text
                .setPlaceholder("YYYY-MM-DD")
				.setValue(transaction.date)
				.onChange((value) => {
					const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
					const error = "Invalid date"
    
					if (!dateRegex.test(value)) {
						new Notice(error)
						return;
					}
					const date = Date.parse(value)
					if (isNaN(date)) {
						new Notice(error)
						return;
					}
					transaction.date = value; 
				})
		})

	const amount = new Setting(this.contentEl)
	    .setName("Amount")
	    .addText((text) => {
	    	text
	    		.setValue(transaction.amount.toString())
	    		.onChange((value) => {
					const amount = parseAmount(value)
					if (isNaN(amount)) {
						new Notice("Invalid number")	
						transaction.amount = null
						return
					}
	    			transaction.amount = amount
	    		})
	    })

	amount.addText((text) => {
		if (!transaction.to_account_id)
			text.setDisabled(true)
		text
            .setPlaceholder("Converted Amount")
			.setValue(transaction.to_amount ? transaction.to_amount.toString() : "")
			.onChange((value) => {
				const amount = parseAmount(value)
				if (isNaN(amount)) {
					new Notice("Invalid number")	
					transaction.to_amount = null
					return
				}
				transaction.to_amount = amount 
			})
		text.inputEl.dataset.key = "to_amount"
	})

	    

	const type = new Setting(this.contentEl)
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


	const from_account = new Setting(this.contentEl)
		.addDropdown((d) => {
			accounts.forEach((account: any) => {
				d.addOption(account.id, account.title)
			})
			d
				.setValue(transaction.account_id)
				.onChange((v) => {
					const value = +v
					if (value == transaction.to_account_id)
						new Notice('Accounts should be different')
					transaction.account_id = value;
				})
		})
		.setName("From Account")

    const to_account = new Setting(this.contentEl)
        .addDropdown((d) => {
            d.setDisabled(true)
        	accounts.forEach((account: any) => {
        		d.addOption(account.id, account.title)
				if (account.id == transaction.to_account_id) {
					d
						.setValue(account.id)
						.setDisabled(false)
				}
        	})
        	d
        		.onChange((v) => {
        			const value = +v
        			if (value == transaction.account_id)
        				new Notice('Accounts should be different')
        			transaction.to_account_id = value;
        		})
		    d.selectEl.dataset.key = "to_account"
        })
        .setName("To Account")

    to_account.addToggle((toggle) => {
		toggle
			.setValue(false)
            .setTooltip("Enable transfer to account", {delay: 1, placement: 'left'})
			.onChange((value) => {
				let to_amountField : BaseComponent
				let to_accountDropdown: BaseComponent

				amount.components.forEach((component: BaseComponent) => {
					if (!component.inputEl)
						return
					else if (component.inputEl.dataset.key == "to_amount")
						to_amountField = component
				})
                to_account.components.forEach((component: BaseComponent) => {
					if (!component.selectEl)
						return 
					else if (component.selectEl.dataset.key == "to_account")
                        to_accountDropdown = component
                })

                if (value) {
				    to_amountField.setDisabled(false)
				    to_amountField.setValue(selected_transaction ? selected_transaction.to_amount : "")
				    to_accountDropdown.setDisabled(false)

                    // Set transaction to type 'Transfer' and disable dropdown
					const typeDropdown = type.components[0]
				    typeDropdown.setDisabled(true)
                    typeDropdown.setValue("Transfer")
                    transaction.transaction_type = typeDropdown.getValue() 

                    transaction.to_account_id = +to_accountDropdown.getValue()
                } else {
                    transaction.to_amount = 0
                    transaction.to_account_id = null

				    to_accountDropdown.setDisabled(true)
				    to_amountField.setDisabled(true)
				    to_amountField.setValue("")

                    // Set transaction type to 'Withdrawal' or back to already existed type and enable dropdown
				    const typeDropdown = type.components[0]
				    typeDropdown.setDisabled(false)
                    typeDropdown.setValue(selected_transaction ? selected_transaction.transaction_type : "Withdrawal")
                    transaction.transaction_type = typeDropdown.getValue() 
                }
			})

		if (!transaction.to_account_id)
			toggle.setValue(false)
	})

	const category = new Setting(this.contentEl)
		.addDropdown((d) => {
			categories.forEach((category: any) => {
				d.addOption(category.id, category.title)
			})
			d
				.setValue(transaction.category_id)
				.onChange((value) => {
					transaction.category_id = +value;
				})
		})
		.setName("Category")

	new Setting(this.contentEl)
		.addDropdown((d) => {
			d.addOption("null", "--Without tag--")
			tags.forEach((tag: any) => {
				d.addOption(tag.id, tag.title)
			})
			d
				.setValue(transaction.tag_id)
				.onChange((value) => {
					transaction.tag_id = +value;
				})
		})
		.setName("Tag")

	const description = new Setting(this.contentEl)
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
			.onClick(async() => {
				let res
				const fields = {
					account_id: from_account.components[0].selectEl,
					category_id: category.components[0].selectEl,
					to_account_id: to_account.components[0].selectEl,
					transaction_type: type.components[0].selectEl,
					amount: amount.components[0].inputEl,
					to_amount: amount.components[1].inputEl,
					date: date.components[0].inputEl,
					description: description?.components[0]?.inputEl,
				}

                if (selected_transaction) {
					res = await this.database.updateTransaction(transaction)
					if (res.error) {
						this.validate(res.detail, fields)
						return
					}
					this.data = res
				} else {
					res = await this.database.insertTransaction(transaction)
					if (res.error) {
						this.validate(res.detail, fields)
						return
					}
					this.data = res
				}

				this.close();
			}));
}
