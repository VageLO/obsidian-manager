import { ManagerDatabase } from '..';
import { createObjFromArray } from './dbHelpers';

// TODO: Refine those sql requests

export async function listTransactions(this: ManagerDatabase) {
    const res = this.db.exec(`SELECT 
Transactions.*,
Accounts.title as 'from_account',
Accounts.currency as 'from_account_currency',
NULL as 'to_account',
NULL as 'to_account_currency',
Categories.title as 'category'
FROM Transactions 
INNER JOIN Categories ON Categories.id = Transactions.category_id
INNER JOIN Accounts ON Accounts.id = Transactions.account_id WHERE Transactions.to_account_id IS NULL

UNION ALL

SELECT
Transactions.*,
from_account.title as 'from_account',
from_account.currency as 'from_account_currency',
to_account.title as 'to_account',
to_account.currency as 'to_account_currency',
Categories.title as 'category'
FROM Transactions 
INNER JOIN Categories ON Categories.id = Transactions.category_id
INNER JOIN Accounts as from_account ON from_account.id = Transactions.account_id
INNER JOIN Accounts as to_account ON to_account.id = Transactions.to_account_id
WHERE Transactions.to_account_id IS NOT NULL
ORDER BY Transactions.date DESC;`)
	
    if (!res.length)
        return []
	const transactions = createObjFromArray(res[0])

    return transactions
}

export async function deleteTransactions(this: ManagerDatabase, ids: number[]) {
    ids.forEach(async(id) => {
        const res = this.db.run(`DELETE FROM Transactions WHERE id = ?`, [id])
        await this.save()

    })
}


export async function insertTransaction(this: ManagerDatabase, t) {
    this.db.run(`INSERT INTO Transactions (account_id, category_id, transaction_type, date, amount, description, to_amount, to_account_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
[
    t.account_id,
    t.category_id,
    t.transaction_type,
    t.date,
    t.amount,
    t.description,
    t.to_amount,
    t.to_account_id])

    id = this.db.exec('SELECT last_insert_rowid();')[0].values[0][0]

    const res = this.db.exec(`SELECT 
Transactions.*,
from_account.title as 'from_account',
from_account.currency as 'from_account_currency',
to_account.title as 'to_account',
to_account.currency as 'to_account_currency',
Categories.title as 'category'
FROM Transactions 
INNER JOIN Categories ON Categories.id = Transactions.category_id
INNER JOIN Accounts as from_account ON from_account.id = Transactions.account_id
INNER JOIN Accounts as to_account ON to_account.id = Transactions.to_account_id
WHERE Transactions.id = ?`, [id])
    if (!res.length)
        return {}

	const transaction = createObjFromArray(res[0])[0]
    await this.save()

    return transaction
}

export async function updateTransaction(this: ManagerDatabase, t) {
    // TODO: update transaction

	//const transaction = createObjFromArray(res[0])[0]
    //await this.save()

    //return transaction
}
