import { Setting, Notice } from 'obsidian';
import { EditModal } from './modal';

export async function transactionModal(this: EditModal, selected_transaction) {
	const accounts = await this.database.listAccounts();
	const categories = await this.database.listCategories();

	interface Transaction {
		account_id: number;
		category_id: number;
		to_account_id: number;
		amount: number;
		to_amount: number;
		transaction_type: string;
		date: string;
		description: string;
	}

	let transaction: Transaction = {
		account_id: null,
		category_id: null,
		to_account_id: null,
		amount: 0,
		to_amount: null,
		transaction_type: "Withdrawal",
		date: new Date().toISOString().split("T")[0],
		description: "",
	}

    if (selected_transaction)
        transaction = {...selected_transaction}

	new Setting(this.contentEl)
		.setName("Date")
		.addText((text) => {
			text
                .setPlaceholder("YYYY-MM-DD")
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
            .setPlaceholder("Converted Amount")
			.setValue(transaction.to_amount ? transaction.to_amount.toString() : "")
			.onChange((value) => {
				value = +value;
				transaction.to_amount = value; 
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

    const to_account = new Setting(this.contentEl)
        .addDropdown((d) => {
            d.setDisabled(true)
        	accounts.forEach((account) => {
        		d.addOption(account.id, account.title)
        	})
        	d
        		.onChange((value) => {
        			value = +value
        			if (value == transaction.account_id)
        				new Notice('Accounts should be different')
        			transaction.to_account_id = value;
        		})
		    d.selectEl.dataset.key = "to_account"
        })
        .setName("To Account")

    to_account.addToggle((toggle) => {
		toggle
			.setValue(true)
            .setTooltip(
                tooltip="Enable transfer to account",
                options={delay: 1, placement: 'left'})
			.onChange((value) => {
				let to_amountField : Setting
				let to_accountDropdown: Setting

				amount.components.forEach((component) => {
					if (!component.inputEl)
						return 
					else if (component.inputEl.dataset.key == "to_amount")
						to_amountField = component
				})
                to_account.components.forEach((component) => {
					if (!component.selectEl)
						return 
					else if (component.selectEl.dataset.key == "to_account")
                        to_accountDropdown = component
                })

                if (value) {
				    to_amountField.setDisabled(false)
				    to_accountDropdown.setDisabled(false)

                    // Set transaction type to Transfer and disable dropdown
				    const typeDropdown = type.components[0]
                    typeDropdown.setValue("Transfer")
                    transaction.transaction_type = typeDropdown.getValue() 
				    typeDropdown.setDisabled(true)

                    transaction.to_account_id = +to_accountDropdown.getValue()
                } else {
                    transaction.to_amount = 0
                    transaction.to_account_id = null

				    to_accountDropdown.setDisabled(true)
				    to_amountField.setDisabled(true)
				    to_amountField.setValue("")

				    const typeDropdown = type.components[0]
				    typeDropdown.setDisabled(false)
                }
			})

		if (!transaction.to_account_id)
			toggle.setValue(false)
	})


        

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
                this.transaction = transaction
				this.close();
			}));
}
