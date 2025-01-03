import { Notice, requestUrl, RequestUrlParam } from 'obsidian';
import { ManagerAPIDatabase } from '../database'

export async function listTransactions(
	this: ManagerAPIDatabase,
	account_id?: number,
	category_id?: number,
	tag_id?: number,
	month?: string,
	year?: number,
	state?: any,
) {

	let conditions: string[] = []
	const query = "/transaction/list" 
	let url = `${this.apiURL}${query}`

	// TODO: Refactor 😿, maybe 🤣.
	if (account_id) {
		conditions.push(`account_id=${account_id}`)
		state((prev: any) => ({...prev, byAccount: account_id}))
	}
	if (category_id) {
		conditions.push(`category_id=${category_id}`)
		state((prev: any) => ({...prev, byCategory: category_id}))
	}
	if (tag_id) {
		conditions.push(`tag_id=${tag_id}`)
		state((prev: any) => ({...prev, byTag: tag_id}))
	}
	if (month) {
		conditions.push(`month=${month}`)
		state((prev: any) => ({...prev, byMonth: month}))
	}
	if (year) {
		conditions.push(`year=${year}`)
		state((prev: any) => ({...prev, byYear: year}))
	}

	url += conditions.length > 0 ? `?${conditions.join('&')}` : ""

	const request: RequestUrlParam = {
	    url: url,
	    method: "GET",
	    headers: {"Cookie": `project=${this.project}`},
		throw: false,
	}
	const res = await requestUrl(request)

	if (res.status != 200)
		this.validateError(res.json.detail, query)

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
	const query = "/transaction/delete"
	const url = `${this.apiURL}${query}`
	const request: RequestUrlParam = {
	    url: url,
	    method: "POST",
	    headers: {"Cookie": `project=${this.project}`},
		body: JSON.stringify(ids),
		throw: false,
	}
	const res = await requestUrl(request)
	if (res.status == 204)
		return true 
	else
		this.validateError(res.json.detail, query)

	return false
}
