import { requestUrl, RequestUrlParam, Notice } from 'obsidian';
import { ManagerAPIDatabase } from '../database'

export async function listCategories(this: ManagerAPIDatabase) {
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

export async function updateCategory(this: ManagerAPIDatabase, category: any) {
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

export async function createCategory(this: ManagerAPIDatabase, category: any) {
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

export async function deleteCategory(this: ManagerAPIDatabase, id: number) {
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
