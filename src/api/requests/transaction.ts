import { requestUrl, RequestUrlParam  } from 'obsidian';
import { ManageAPIDatabase } from '../database'

// TODO: Make exceptions

export async function listTransactions(this: ManageAPIDatabase, account_id?: number, category_id?: number) {
	const url = `${this.apiURL}/transaction/list`
	const request: RequestUrlParam = {
	    url: url,
	    method: "GET",
	    headers: {"Cookie": `project=${this.project}`},
	}
	const res = await requestUrl(request)
	return res.json
}

export async function deleteTransactions(this: ManageAPIDatabase, ids: number[]) {
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
