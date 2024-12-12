import { ManagerDatabase } from '..';
import { QueryExecResult } from 'sql.js';
import { 
	allTransactions,
	getTransactionById,
} from './queries'
import { createObjFromArray } from './dbHelpers';

export async function listTransactions(this: ManagerDatabase, account_id?: number, category_id?: number) {
	let res : QueryExecResult[] = []

	if (account_id && category_id)
		res = this.db.exec(allTransactions(`AND Transactions.account_id=${account_id} AND Transactions.category_id=${category_id}`))
	else if (account_id)
		res = this.db.exec(allTransactions(`AND Transactions.account_id=${account_id}`))
	else if (category_id)
		res = this.db.exec(allTransactions(`AND Transactions.category_id=${category_id}`))
	else
		res = this.db.exec(allTransactions(''))

    if (!res.length)
        return []
	const transactions = createObjFromArray(res[0])

    return transactions
}

export async function deleteTransactions(this: ManagerDatabase, ids: number[]) {
    ids.forEach(async(id) => {
        this.db.run(`DELETE FROM Transactions WHERE id = ?`, [id])
        await this.save()
    })
}

export async function insertTransaction(this: ManagerDatabase, t: any) {
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

    const id = this.db.exec('SELECT last_insert_rowid();')[0].values[0][0]
    await this.save()

    const res = this.db.exec(getTransactionById, [id, id])
    if (!res.length)
        return {}

	const transaction = createObjFromArray(res[0])[0]

    return transaction
}

export async function updateTransaction(this: ManagerDatabase, t: any) {

	this.db.exec(`UPDATE Transactions SET account_id = ?, category_id = ?, transaction_type = ?, date = ?, amount = ?, description = ?, to_account_id = ?, to_amount = ? WHERE id = ?`,
	[
		t.account_id,
		t.category_id,
    	t.transaction_type,
    	t.date,
    	t.amount,
    	t.description,
    	t.to_account_id,
    	t.to_amount,
		t.id,
	])

    await this.save()
	const res = this.db.exec(getTransactionById, [t.id, t.id])

    if (!res.length)
        return {}

	const transaction = createObjFromArray(res[0])[0]

    return transaction
}
