import { requestUrl, RequestUrlParam, Notice } from 'obsidian';
import { ManagerAPIDatabase } from '../database'

export async function listCategories(this: ManagerAPIDatabase) {
    const request: RequestUrlParam = {
        url: `${this.apiURL}/category/list`,
        method: "GET",
        headers: {"Cookie": `project=${this.project}`},
    }
    const res = await requestUrl(request)
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
    const request: RequestUrlParam = {
        url: `${this.apiURL}/category/delete?id=${id}`,
        method: "GET",
        headers: {"Cookie": `project=${this.project}`},
    }
    const res = await requestUrl(request)
	if (res.status == 204)
		return id
	return 0
}
