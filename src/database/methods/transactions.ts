import { ManagerDatabase } from '..';
import { QueryExecResult } from 'sql.js';
import { allTransactions } from './queries'
import { createObjFromArray } from './dbHelpers';

export async function listTransactions(
	this: ManagerDatabase,
	account_id?: number,
	category_id?: number,
	tag_id?: number
) {

	let conditions: string[] = []

	if (account_id)
		conditions.push(`Transactions.account_id == ${account_id}`)
	if (category_id)
		conditions.push(`Transactions.category_id == ${category_id}`)
	if (tag_id)
		conditions.push(`Transactions.tag_id == ${tag_id}`)

	const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ""

	const res = this.db.exec(allTransactions(where))

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
    this.db.run(`
	INSERT INTO Transactions (
	account_id,
	category_id,
	tag_id,
	transaction_type,
	date,
	amount,
	description,
	to_amount,
	to_account_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`, 
[
    t.account_id,
    t.category_id,
    t.tag_id,
    t.transaction_type,
    t.date,
    t.amount,
    t.description,
    t.to_amount,
    t.to_account_id])

    const id = this.db.exec('SELECT last_insert_rowid();')[0].values[0][0]
    await this.save()

    const res = this.db.exec(allTransactions(`WHERE Transactions.id = ?`), [id])
    if (!res.length)
        return {}

	const transaction = createObjFromArray(res[0])[0]

    return transaction
}

export async function updateTransaction(this: ManagerDatabase, t: any) {

	this.db.exec(`
		UPDATE Transactions SET 
		account_id = ?,
		category_id = ?,
		tag_id = ?,
		transaction_type = ?,
		date = ?,
		amount = ?,
		description = ?,
		to_account_id = ?,
		to_amount = ?
		WHERE id = ?
	`,
	[
		t.account_id,
		t.category_id,
		t.tag_id,
    	t.transaction_type,
    	t.date,
    	t.amount,
    	t.description,
    	t.to_account_id,
    	t.to_amount,
		t.id,
	])

    await this.save()
	const res = this.db.exec(allTransactions(`WHERE Transactions.id = ?`), [t.id])

    if (!res.length)
        return {}

	const transaction = createObjFromArray(res[0])[0]

    return transaction
}
