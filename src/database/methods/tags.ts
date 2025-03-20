import { CustomError, Tag } from 'types';
import { ManagerDatabase } from '..'
import { createObjFromArray } from './dbHelpers';

export async function listTags(
	this: ManagerDatabase
): Promise<Tag[]> {
	const res = this.db.exec("SELECT * FROM Tags ORDER BY title ASC")
    if (!res.length)
        return []
	const tags = createObjFromArray(res[0])
    return tags
}

export async function updateTag(
	this: ManagerDatabase,
	tag: Tag
): Promise<Tag | CustomError> {
	try {
		this.db.exec(`UPDATE Tags SET title = ? WHERE id = ?`,
		[
			tag.title,
			tag.id,
		])
	} catch(e) {
		const detail = this.validateError(e.message)
		return {error: true, detail: detail}
	}

    await this.save()

    const res = this.db.exec('SELECT * FROM Tags WHERE id = ?', [tag.id])
	if (!res.length)
        return {}

	const updated_tag = createObjFromArray(res[0])[0]
	return updated_tag
}

export async function createTag(
	this: ManagerDatabase,
	tag: Tag
): Promise<Tag | CustomError> {
	try {
		this.db.run(`INSERT INTO Tags (title) VALUES (?)`, [tag.title])
	} catch (e) {
		const detail = this.validateError(e.message)
		return {error: true, detail: detail}
	}

    const id = this.db.exec('SELECT last_insert_rowid();')[0].values[0][0]
    await this.save()

    const res = this.db.exec('SELECT * FROM Tags WHERE id = ?', [id])

    if (!res.length)
        return {}

	const new_tag = createObjFromArray(res[0])[0]
	return new_tag
}

export async function deleteTag(
	this: ManagerDatabase,
	id: number
): Promise<number> {
	try {
		this.db.run(`DELETE FROM Tags WHERE id = ?`, [id])
		await this.save()
		return id
	} catch {
		return 0
	}
}
