import { requestUrl, RequestUrlParam  } from 'obsidian';

const api = `http://localhost:8000/api/manager`
export async function getTransactions(project: string, account_id?: int, category_id?: int) {
    const url = `${api}/transaction/list`
    const request: RequestUrlParam = {
        url: url,
        method: "GET",
        headers: {"Cookie": `project=${project}`},
    }
    const res = await requestUrl(request)
    console.log(res.json)
}

export async function getAccounts(project: string) {
    const request: RequestUrlParam = {
        url: `${api}/account/list`,
        method: "GET",
        headers: {"Cookie": `project=${project}`},
    }
    const res = await requestUrl(request)
    console.log(res.json)
}

export async function getCategories(project: string) {
    const request: RequestUrlParam = {
        url: `${api}/category/list`,
        method: "GET",
        headers: {"Cookie": `project=${project}`},
    }
    const res = await requestUrl(request)
    console.log(res.json)
}
