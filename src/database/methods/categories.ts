import { ManagerDatabase } from '..'
import { createObjFromArray } from './dbHelpers';

export async function listCategories(this: ManagerDatabase) {
	const res = this.db.exec("SELECT * FROM Categories")
	const categories = createObjFromArray(res[0])

    return categories
}
