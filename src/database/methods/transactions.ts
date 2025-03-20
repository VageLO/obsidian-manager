import { ManagerDatabase } from '..';
import { allTransactions } from './queries'
import { createObjFromArray } from './dbHelpers';
import { CustomError, Transaction, TransactionDetails } from 'types';

export function getMonthStartEnd(YMString: string) {
    const [year, month] = YMString.split('-').map(Number);
    const end = new Date(year, month, 0);

    return {
        start: `${year}-${String(month).padStart(2, '0')}-01`,
        end: `${year}-${String(month).padStart(2, '0')}-${end.getDate()}`
    };
}

export async function listTransactions(
	this: ManagerDatabase,
	account_id?: number,
	category_id?: number,
	tag_id?: number,
	month?: string,
	year?: number,
	state?: any,
): Promise<TransactionDetails[]> {

	let conditions: string[] = []

	if (account_id) {
		conditions.push(`Transactions.account_id == ${account_id}`)
		state((prev: any) => ({...prev, byAccount: account_id}))
	}
	if (category_id) {
		conditions.push(`Transactions.category_id == ${category_id}`)
		state((prev: any) => ({...prev, byCategory: category_id}))
	}
	if (tag_id) {
		conditions.push(`Transactions.tag_id == ${tag_id}`)
		state((prev: any) => ({...prev, byTag: tag_id}))
	}
	if (month) {
		const { start, end } = getMonthStartEnd(month)
		conditions.push(`Transactions.date >= '${start}'`)
		conditions.push(`Transactions.date <= '${end}'`)
		state((prev: any) => ({...prev, byMonth: month}))
	}
	if (year) {
		conditions.push(`Transactions.date >= '${year}-01-01'`)
		conditions.push(`Transactions.date <= '${year}-12-31'`)
		state((prev: any) => ({...prev, byYear: year}))
	}

	const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ""

	const res = this.db.exec(allTransactions(where))

    if (!res.length)
        return []
	const transactions = createObjFromArray(res[0])

    return transactions
}

export async function deleteTransactions(
	this: ManagerDatabase,
	ids: number[]
): Promise<boolean> {
    ids.forEach(async(id) => {
        this.db.run(`DELETE FROM Transactions WHERE id = ?`, [id])
        await this.save()
    })
	return true
}

export async function insertTransaction(
	this: ManagerDatabase,
	transaction: Transaction
): Promise<TransactionDetails | CustomError> {
    try {
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
		to_account_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
	[
	    transaction.account_id,
	    transaction.category_id,
	    transaction.tag_id,
	    transaction.transaction_type,
	    transaction.date,
	    transaction.amount,
	    transaction.description,
	    transaction.to_amount,
	    transaction.to_account_id

	])} catch (e) {
		const detail = this.validateError(e.message)
		return {error: true, detail: detail}
	}

    const id = this.db.exec('SELECT last_insert_rowid();')[0].values[0][0]
    await this.save()

    const res = this.db.exec(allTransactions(`WHERE Transactions.id = ?`), [id])
    if (!res.length)
        return {}

	const inserted_transaction = createObjFromArray(res[0])[0]

    return inserted_transaction
}

export async function updateTransaction(
	this: ManagerDatabase,
	transaction: Transaction
): Promise<TransactionDetails | CustomError> {

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
		transaction.account_id,
		transaction.category_id,
		transaction.tag_id,
    	transaction.transaction_type,
    	transaction.date,
    	transaction.amount,
    	transaction.description,
    	transaction.to_account_id,
    	transaction.to_amount,
		transaction.id ?? 0,
	])

    await this.save()
	const res = this.db.exec(allTransactions(`WHERE Transactions.id = ?`), [transaction.id ?? 0])

    if (!res.length)
        return {}

	const updated_transaction = createObjFromArray(res[0])[0]

    return updated_transaction
}
