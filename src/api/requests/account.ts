import { requestUrl, RequestUrlParam  } from 'obsidian';
import { ManagerAPIDatabase } from '../database'

export async function listAccounts(this: ManagerAPIDatabase) {
    const request: RequestUrlParam = {
        url: `${this.apiURL}/account/list`,
        method: "GET",
        headers: {"Cookie": `project=${this.project}`},
    }
    const res = await requestUrl(request)
    return res.json
}

export async function updateAccount(this: ManagerAPIDatabase, account: any) {
    const request: RequestUrlParam = {
        url: `${this.apiURL}/account/update`,
        method: "POST",
        headers: {"Cookie": `project=${this.project}`},
		body: JSON.stringify(account),
    }
    const res = await requestUrl(request)
    return res.json
}

export async function createAccount(this: ManagerAPIDatabase, account: any) {
    const request: RequestUrlParam = {
        url: `${this.apiURL}/account/create`,
        method: "POST",
        headers: {"Cookie": `project=${this.project}`},
		body: JSON.stringify(account),
    }
    const res = await requestUrl(request)
    return res.json
}

export async function deleteAccount(this: ManagerAPIDatabase, id: number) {
    const request: RequestUrlParam = {
        url: `${this.apiURL}/account/delete?id=${id}`,
        method: "GET",
        headers: {"Cookie": `project=${this.project}`},
    }
    const res = await requestUrl(request)
	if (res.status == 204)
		return id
	return 0
}
