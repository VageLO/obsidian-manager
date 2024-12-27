import { requestUrl, Notice, RequestUrlParam  } from 'obsidian';
import { ManagerAPIDatabase } from '../database'

export async function listAccounts(this: ManagerAPIDatabase) {
	const query = "/account/list"
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

export async function updateAccount(this: ManagerAPIDatabase, account: any) {
    const request: RequestUrlParam = {
        url: `${this.apiURL}/account/update`,
        method: "POST",
        headers: {"Cookie": `project=${this.project}`},
		body: JSON.stringify(account),
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

export async function createAccount(this: ManagerAPIDatabase, account: any) {
    const request: RequestUrlParam = {
        url: `${this.apiURL}/account/create`,
        method: "POST",
        headers: {"Cookie": `project=${this.project}`},
		body: JSON.stringify(account),
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

export async function deleteAccount(this: ManagerAPIDatabase, id: number) {
	const query = "/account/delete"
    const request: RequestUrlParam = {
        url: `${this.apiURL}${query}?id=${id}`,
        method: "GET",
        headers: {"Cookie": `project=${this.project}`},
    }
    const res = await requestUrl(request)

	if (res.status == 204)
		return id
	else
		this.validateError(res.json.detail, query)

	return 0
}
