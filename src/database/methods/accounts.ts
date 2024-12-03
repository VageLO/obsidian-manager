import { ManagerDatabase } from '..'

export async function listAccounts(this: ManagerDatabase) {
    const res = this.db.exec("SELECT * FROM Accounts")
    return res
}
