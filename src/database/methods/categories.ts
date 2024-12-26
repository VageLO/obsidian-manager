import { ManagerDatabase } from '..'
import { createObjFromArray } from './dbHelpers';

export async function listCategories(this: ManagerDatabase) {
	const res = this.db.exec("SELECT * FROM Categories")
    if (!res.length)
        return []
	const categories = createObjFromArray(res[0])

    return categories
}

export async function updateCategory(this: ManagerDatabase, category: any) {

	try {
		this.db.exec(`UPDATE Categories SET title = ?, parent_id = ? WHERE id = ?`,
		[
			category.title,
			category.parent_id,
			category.id,
		])
	} catch(e) {
		const detail = this.validateError(e.message)
		return {error: true, detail: detail}
	}

    await this.save()

    const res = this.db.exec('SELECT * FROM Categories WHERE id = ?', [category.id])
	if (!res.length)
        return {}

	const updated_category = createObjFromArray(res[0])[0]
	return updated_category
}


export async function createCategory(this: ManagerDatabase, category: any) {
	try {
		this.db.run(`INSERT INTO Categories (title, parent_id) VALUES (?, ?)`, [
			category.title,
			category.parent_id,
		])
	} catch(e) {
		const detail = this.validateError(e.message)
		return {error: true, detail: detail}
	}

    const id = this.db.exec('SELECT last_insert_rowid();')[0].values[0][0]
    await this.save()

    const res = this.db.exec('SELECT * FROM Categories WHERE id = ?', [id])

    if (!res.length)
        return {}

	const new_category = createObjFromArray(res[0])[0]
	return new_category
}

export async function deleteCategory(this: ManagerDatabase, id: number) {
	try {
		this.db.run(`DELETE FROM Categories WHERE id = ?`, [id])
		await this.save()
		return id
	} catch {
		return
	}
}
