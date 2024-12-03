import { ManagerDatabase } from '..'
import { createObjFromArray } from './dbHelpers';

export async function listAccounts(this: ManagerDatabase) {
	const res = this.db.exec("SELECT * FROM Accounts")
	const accounts = createObjFromArray(res[0])

	return accounts
}
