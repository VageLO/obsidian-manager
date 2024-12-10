import { requestUrl, RequestUrlParam  } from 'obsidian';
import { ManageAPIDatabase } from '../database'

export async function listAccounts(this: ManageAPIDatabase) {
    const request: RequestUrlParam = {
        url: `${this.apiURL}/account/list`,
        method: "GET",
        headers: {"Cookie": `project=${this.project}`},
    }
    const res = await requestUrl(request)
    return res.json
}
