import { Notice, requestUrl, RequestUrlParam  } from 'obsidian';
import { ManagerAPIDatabase } from '../database'

// TODO: Make exceptions

export async function listTransactions(this: ManagerAPIDatabase, account_id?: number, category_id?: number) {

	let url = `${this.apiURL}/transaction/list`
	if (account_id && category_id)
		url +=`?account_id=${account_id}&category_id=${category_id}`
	else if (account_id)
		url +=`?account_id=${account_id}`
	else if (account_id)
		url +=`?category_id=${account_id}`
	
	console.log(url)

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
	}
	try {
		const res = await requestUrl(request)
		if (res.status == 201)
			return res.json
	}
	catch(e) {
		new Notice(e)
		return {} 
	}
}

export async function updateTransaction(this: ManagerAPIDatabase, transaction: any) {
	const url = `${this.apiURL}/transaction/update`
	const request: RequestUrlParam = {
	    url: url,
	    method: "POST",
	    headers: {"Cookie": `project=${this.project}`},
		body: JSON.stringify(transaction),
	}
	try {
		const res = await requestUrl(request)
		if (res.status == 200)
			return res.json
	}
	catch(e) {
		new Notice(e)
		return {} 
	}
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
