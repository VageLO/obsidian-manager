import { requestUrl, RequestUrlParam  } from 'obsidian';
import { ManagerAPIDatabase } from '../database'

export async function listTags(this: ManagerAPIDatabase) {
    const request: RequestUrlParam = {
        url: `${this.apiURL}/tag/list`,
        method: "GET",
        headers: {"Cookie": `project=${this.project}`},
    }
    const res = await requestUrl(request)
    return res.json
}

export async function updateTag(this: ManagerAPIDatabase, tag: any) {
    const request: RequestUrlParam = {
        url: `${this.apiURL}/tag/update`,
        method: "POST",
        headers: {"Cookie": `project=${this.project}`},
		body: JSON.stringify(tag),
    }
    const res = await requestUrl(request)
    return res.json
}

export async function createTag(this: ManagerAPIDatabase, tag: any) {
    const request: RequestUrlParam = {
        url: `${this.apiURL}/tag/create`,
        method: "POST",
        headers: {"Cookie": `project=${this.project}`},
		body: JSON.stringify(tag),
    }
    const res = await requestUrl(request)
    return res.json
}

export async function deleteTag(this: ManagerAPIDatabase, id: number) {
    const request: RequestUrlParam = {
        url: `${this.apiURL}/tag/delete?id=${id}`,
        method: "GET",
        headers: {"Cookie": `project=${this.project}`},
    }
    const res = await requestUrl(request)
	if (res.status == 204)
		return id
	return 0
}
