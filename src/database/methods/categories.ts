import { ManagerDatabase } from '..'

export async function listCategories(this: ManagerDatabase) {
    const res = this.db.exec("SELECT * FROM Categories")
    return res
}
