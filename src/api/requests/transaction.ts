import { requestUrl, RequestUrlParam  } from 'obsidian';
import { ManageAPIDatabase } from '../database'

export async function listTransactions(this: ManageAPIDatabase, account_id?: int, category_id?: int) {
	const url = `${this.apiURL}/transaction/list`
	const request: RequestUrlParam = {
	    url: url,
	    method: "GET",
	    headers: {"Cookie": `project=${this.project}`},
	}
	const res = await requestUrl(request)
	return res.json
}
