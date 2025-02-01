export const init = (db: any) => {
	// Tables
	db.run(accounts_table)
	db.run(categories_table)
	db.run(tags_table)
	db.run(transactions_table)
	// Triggers
	db.run(trigger_tran_delete)
	db.run(trigger_tran_insert)
	db.run(trigger_tran_update)
	db.run(trigger_toaccount_update)
}

const accounts_table = `CREATE TABLE IF NOT EXISTS "Accounts" (
	id INTEGER NOT NULL, 
	title VARCHAR(255) NOT NULL, 
	currency VARCHAR(255) NOT NULL, 
	balance NUMERIC NOT NULL, 
	PRIMARY KEY (id), 
	UNIQUE (title)
)`;

const categories_table = `CREATE TABLE IF NOT EXISTS "Categories" (
	id INTEGER NOT NULL, 
	parent_id INTEGER, 
	title VARCHAR(255) NOT NULL, 
	PRIMARY KEY (id), 
	UNIQUE (title)
)`

const tags_table = `CREATE TABLE IF NOT EXISTS "Tags" (
	id INTEGER NOT NULL, 
	title VARCHAR(255) NOT NULL, 
	PRIMARY KEY (id), 
	UNIQUE (title)
)`

const transactions_table = `CREATE TABLE IF NOT EXISTS "Transactions" (
	id INTEGER NOT NULL, 
	account_id INTEGER NOT NULL, 
	to_account_id INTEGER, 
	category_id INTEGER NOT NULL, 
	tag_id INTEGER, 
	transaction_type VARCHAR(10), 
	date DATE NOT NULL, 
	amount NUMERIC NOT NULL, 
	to_amount NUMERIC NOT NULL, 
	description VARCHAR(255), 
	PRIMARY KEY (id), 
	FOREIGN KEY(account_id) REFERENCES "Accounts" (id) ON DELETE CASCADE, 
	FOREIGN KEY(to_account_id) REFERENCES "Accounts" (id) ON DELETE CASCADE, 
	FOREIGN KEY(category_id) REFERENCES "Categories" (id) ON DELETE CASCADE, 
	FOREIGN KEY(tag_id) REFERENCES "Tags" (id) ON DELETE SET NULL
)`

const trigger_tran_delete = `CREATE TRIGGER IF NOT EXISTS Update_Balance_On_Transaction_Delete
AFTER DELETE ON Transactions
FOR EACH ROW

BEGIN
	UPDATE Accounts
	SET balance = CASE
		WHEN old.transaction_type = 'Withdrawal' OR old.transaction_type = 'Transfer'
		THEN ROUND((SELECT balance FROM Accounts WHERE id = old.account_id) + old.amount, 2)
		
		WHEN old.transaction_type = 'Deposit'
		THEN ROUND((SELECT balance FROM Accounts WHERE id = old.account_id) - old.amount, 2)
		
		ELSE RAISE(ABORT, "ELSE UPDATE Accounts ON DELETE")
	END WHERE id = old.account_id;
	
	UPDATE Accounts
	SET balance = CASE
		WHEN old.to_account_id IS NOT NULL AND (old.to_amount IS NOT NULL AND old.to_amount <> 0)
		THEN ROUND((SELECT balance FROM Accounts WHERE id = old.to_account_id) - old.to_amount, 2)
		
		WHEN old.to_account_id IS NOT NULL AND old.amount IS NOT NULL
		THEN ROUND((SELECT balance FROM Accounts WHERE id = old.to_account_id) - old.amount, 2)
		
		ELSE RAISE(IGNORE)
	END WHERE id = old.to_account_id;
END`

const trigger_tran_insert = `CREATE TRIGGER IF NOT EXISTS Update_Balance_On_Transaction_Insert
AFTER INSERT ON Transactions
FOR EACH ROW

BEGIN
	UPDATE Accounts
	SET balance = CASE
		WHEN new.transaction_type = 'Withdrawal' OR new.transaction_type = 'Transfer'
		THEN ROUND((SELECT balance FROM Accounts WHERE id = new.account_id) - new.amount, 2)
		
		WHEN new.transaction_type = 'Deposit'
		THEN ROUND((SELECT balance FROM Accounts WHERE id = new.account_id) + new.amount, 2)
		
		ELSE RAISE(IGNORE)
	END WHERE id = new.account_id;
	
	UPDATE Accounts
	SET balance = CASE
		WHEN new.to_account_id IS NOT NULL AND (new.to_amount IS NOT NULL AND new.to_amount <> 0)
		THEN ROUND((SELECT balance FROM Accounts WHERE id = new.to_account_id) + new.to_amount, 2)
		
		WHEN new.to_account_id IS NOT NULL AND new.amount IS NOT NULL
		THEN ROUND((SELECT balance FROM Accounts WHERE id = new.to_account_id) + new.amount, 2)
		
		ELSE RAISE(IGNORE)
	END WHERE id = new.to_account_id;
END`

const trigger_tran_update = `CREATE TRIGGER IF NOT EXISTS Update_Balance_On_Transaction_Update
AFTER UPDATE ON Transactions
FOR EACH ROW

BEGIN

	UPDATE Accounts
	SET balance = CASE
		-- Update new.account if new.account_id EQUAL old.account_id
		WHEN new.account_id = old.account_id
		THEN CASE
			WHEN new.transaction_type = 'Withdrawal' AND (old.transaction_type = 'Withdrawal' OR old.transaction_type = 'Transfer')
			THEN ROUND(((SELECT balance FROM Accounts WHERE id = new.account_id) + old.amount) - new.amount, 2)
			
			WHEN new.transaction_type = 'Withdrawal' AND old.transaction_type = 'Deposit'
			THEN ROUND(((SELECT balance FROM Accounts WHERE id = new.account_id) - old.amount) - new.amount, 2)
			
			WHEN new.transaction_type = 'Deposit' AND (old.transaction_type = 'Withdrawal' OR old.transaction_type = 'Transfer')
			THEN ROUND(((SELECT balance FROM Accounts WHERE id = new.account_id) + old.amount) + new.amount, 2)
			
			WHEN new.transaction_type = 'Deposit' AND old.transaction_type = 'Deposit'
			THEN ROUND(((SELECT balance FROM Accounts WHERE id = new.account_id) - old.amount) + new.amount, 2)
			
			WHEN new.transaction_type = 'Transfer' AND (old.transaction_type = 'Withdrawal' OR old.transaction_type = 'Transfer')
			THEN ROUND(((SELECT balance FROM Accounts WHERE id = new.account_id) + old.amount) - new.amount, 2)
			
			WHEN new.transaction_type = 'Transfer' AND old.transaction_type = 'Deposit'
			THEN ROUND(((SELECT balance FROM Accounts WHERE id = new.account_id) - old.amount) - new.amount, 2)

			ELSE RAISE(ABORT, "-- Update new.account if new.account_id EQUAL old.account_id")
			END
			
		WHEN new.account_id <> old.account_id
		THEN CASE
			WHEN new.transaction_type = 'Withdrawal' OR new.transaction_type = 'Transfer'
			THEN ROUND((SELECT balance FROM Accounts WHERE id = new.account_id) - new.amount, 2)

			WHEN new.transaction_type = 'Deposit'
			THEN ROUND((SELECT balance FROM Accounts WHERE id = new.account_id) + new.amount, 2)

			ELSE RAISE(ABORT, "-- Update new.account if new.account_id NOT EQUAL old.account_id")
			END

	END WHERE id = new.account_id;
	
	-- Update old.account if new.account_id NOT EQUAL old.account_id
	UPDATE Accounts
	SET balance = CASE
		WHEN new.account_id <> old.account_id
		THEN CASE 
			WHEN old.transaction_type = 'Withdrawal' OR old.transaction_type = 'Transfer'
			THEN ROUND((SELECT balance FROM Accounts WHERE id = old.account_id) + old.amount, 2)

			WHEN old.transaction_type = 'Deposit'
			THEN ROUND((SELECT balance FROM Accounts WHERE id = old.account_id) - old.amount, 2)

			ELSE RAISE(ABORT, "Update old.account if new.account_id NOT EQUAL old.account_id")
			END
		ELSE RAISE(IGNORE)
	END WHERE id = old.account_id;
	
END`

const trigger_toaccount_update = `CREATE TRIGGER IF NOT EXISTS Update_ToAccount_Balance
AFTER UPDATE ON Transactions
FOR EACH ROW

BEGIN
	
	-- Update new.to_account with NEW data
	UPDATE Accounts
	SET balance = CASE
		WHEN new.to_account_id IS NOT NULL AND (new.to_amount IS NOT NULL AND new.to_amount <> 0)
		THEN ROUND((SELECT balance FROM Accounts WHERE id = new.to_account_id) + new.to_amount, 2)
		
		WHEN new.to_account_id IS NOT NULL AND new.amount IS NOT NULL
		THEN ROUND((SELECT balance FROM Accounts WHERE id = new.to_account_id) + new.amount, 2)
		
		ELSE RAISE(ABORT, "Update new.to_account with NEW data")
	END WHERE id = new.to_account_id;
	
	-- Update old.to_account with OLD data
	UPDATE Accounts
	SET balance = CASE
		WHEN old.to_account_id IS NOT NULL AND (old.to_amount IS NOT NULL AND old.to_amount <> 0)
		THEN ROUND((SELECT balance FROM Accounts WHERE id = old.to_account_id) - old.to_amount, 2)
		
		WHEN old.to_account_id IS NOT NULL AND old.amount IS NOT NULL
		THEN ROUND((SELECT balance FROM Accounts WHERE id = old.to_account_id) - old.amount, 2)
		
		ELSE RAISE(ABORT, "Update old.to_account with OLD data")
	END WHERE id = old.to_account_id;
	
END`
