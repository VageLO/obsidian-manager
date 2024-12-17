import { Notice, requestUrl, RequestUrlParam  } from 'obsidian';
import { ManagerAPIDatabase } from '../database'

// TODO: Make exceptions

export async function listTransactions(
	this: ManagerAPIDatabase,
	account_id?: number,
	category_id?: number,
	tag_id?: number
) {

	let conditions: string[] = []
	let url = `${this.apiURL}/transaction/list`

	if (account_id)
		conditions.push(`account_id=${account_id}`)
	if (category_id)
		conditions.push(`category_id=${category_id}`)
	if (tag_id)
		conditions.push(`tag_id=${tag_id}`)
	
	url += conditions.length > 0 ? `?${conditions.join('&')}` : ""

	const request: RequestUrlParam = {
	    url: url,
	    method: "GET",
	    headers: {"Cookie": `project=${this.project}`},
	}
	const res = await requestUrl(request)
	return res.json
}

export async function insertTransaction(this: ManagerAPIDatabase, transaction: any) {
	const url = `${this.apiURL}/transaction/create`
	const request: RequestUrlParam = {
	    url: url,
	    method: "POST",
	    headers: {"Cookie": `project=${this.project}`},
		body: JSON.stringify(transaction),
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

export async function updateTransaction(this: ManagerAPIDatabase, transaction: any) {
	const url = `${this.apiURL}/transaction/update`
	const request: RequestUrlParam = {
	    url: url,
	    method: "POST",
	    headers: {"Cookie": `project=${this.project}`},
		body: JSON.stringify(transaction),
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

export async function deleteTransactions(this: ManagerAPIDatabase, ids: number[]) {
	const url = `${this.apiURL}/transaction/delete`
	const request: RequestUrlParam = {
	    url: url,
	    method: "POST",
	    headers: {"Cookie": `project=${this.project}`},
		body: JSON.stringify(ids),
	}
	const res = await requestUrl(request)
	if (res.status == 204)
		return true 
	return false
}
