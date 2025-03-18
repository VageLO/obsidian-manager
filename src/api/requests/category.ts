import { requestUrl, RequestUrlParam, Notice } from 'obsidian';
import { Category, CustomError } from 'types';
import { ManagerAPIDatabase } from '../database'

export async function listCategories(
	this: ManagerAPIDatabase
): Promise<Category[]> {
	const query = `/category/list` 
    const request: RequestUrlParam = {
        url: `${this.apiURL}${query}`,
        method: "GET",
        headers: {"Cookie": `project=${this.project}`},
		throw: false,
    }
    const res = await requestUrl(request)

	if (res.status != 200)
		this.validateError(res.json.detail, query)

    return res.json
}

export async function updateCategory(
	this: ManagerAPIDatabase,
	category: Category
): Promise<Category | CustomError> {
    const request: RequestUrlParam = {
        url: `${this.apiURL}/category/update`,
        method: "POST",
        headers: {"Cookie": `project=${this.project}`},
		body: JSON.stringify(category),
		throw: false,
    }
    const res = await requestUrl(request)
	if (res.status == 200)
		return res.json
	else if (!res.json.detail) {
		new Notice("Error: detail not found")
		return {}
	}
	return {error: true, detail: res.json.detail}
}

export async function createCategory(
	this: ManagerAPIDatabase,
	category: Category
): Promise<Category | CustomError> {
    const request: RequestUrlParam = {
        url: `${this.apiURL}/category/create`,
        method: "POST",
        headers: {"Cookie": `project=${this.project}`},
		body: JSON.stringify(category),
		throw: false,
    }
    const res = await requestUrl(request)
	if (res.status == 201)
		return res.json
	else if (!res.json.detail) {
		new Notice("Error: detail not found")
		return {}
	}
	return {error: true, detail: res.json.detail}
}

export async function deleteCategory(
	this: ManagerAPIDatabase,
	id: number
): Promise<number> {
	const query = "/category/delete"
    const request: RequestUrlParam = {
        url: `${this.apiURL}${query}?id=${id}`,
        method: "GET",
        headers: {"Cookie": `project=${this.project}`},
		throw: false,
    }
    const res = await requestUrl(request)
	if (res.status == 204)
		return id
	else
		this.validateError(res.json.detail, query)

	return 0
}
