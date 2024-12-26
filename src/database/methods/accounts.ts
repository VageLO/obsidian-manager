import { ManagerDatabase } from '..'
import { createObjFromArray } from './dbHelpers';

export async function listAccounts(this: ManagerDatabase) {
	const res = this.db.exec("SELECT * FROM Accounts")
    if (!res.length)
        return []
	const accounts = createObjFromArray(res[0])

	return accounts
}

export async function updateAccount(this: ManagerDatabase, account: any) {

	try {
		this.db.exec(`UPDATE Accounts SET title = ?, currency = ?, balance = ? WHERE id = ?`,
		[
			account.title,
			account.currency,
			account.balance,
			account.id,
		])
	} catch(e) {
		const detail = this.validateError(e.message)
		return {error: true, detail: detail}
	}

    await this.save()

    const res = this.db.exec('SELECT * FROM Accounts WHERE id = ?', [account.id])
	if (!res.length)
        return {}

	const updated_account = createObjFromArray(res[0])[0]
	return updated_account
}


export async function createAccount(this: ManagerDatabase, account: any) {
	try {
		this.db.run(`INSERT INTO Accounts (title, currency, balance) VALUES (?, ?, ?)`, [
			account.title,
			account.currency,
			account.balance,
		])
	} catch(e) {
		const detail = this.validateError(e.message)
		return {error: true, detail: detail}
	}

    const id = this.db.exec('SELECT last_insert_rowid();')[0].values[0][0]
    await this.save()

    const res = this.db.exec('SELECT * FROM Accounts WHERE id = ?', [id])

    if (!res.length)
        return {}

	const new_account = createObjFromArray(res[0])[0]
	return new_account
}

export async function deleteAccount(this: ManagerDatabase, id: number) {
	try {
		this.db.run(`DELETE FROM Accounts WHERE id = ?`, [id])
		await this.save()
		return id
	} catch {
		return
	}
}
