import { createContext, useEffect, useContext, useState } from 'react';

export const ResourcesContext = createContext();

export const ResourceProvider = ({children, db}) => {

    const [transactions, setTransactions] = useState([])
    const [accounts, setAccounts] = useState([])
    const [categories, setCategories] = useState([])
    const [tags, setTags] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState({
		byAccount: null,
		byCategory: null,
		byTag: null,
	})
    
	const setResources = async() => {
		setTransactions(await db.listTransactions())
		setAccounts(await db.listAccounts())
		setCategories(await db.listCategories())
		setTags(await db.listTags())
		setLoading(false)
	} 

    useEffect(() => {
		setResources()
    }, [])

    const resources = {
        db: db,
        transactions: transactions,
        setTransactions: setTransactions,
        categories: categories,
        setCategories: setCategories,
        accounts: accounts,
        setAccounts: setAccounts,
        tags: tags,
        setTags: setTags,
		filter: filter,
		setFilter: setFilter,
    }

	if (loading) {
		return (
			<div>Loading</div>
		)
	}
    return (
        <ResourcesContext.Provider value={resources}>
            {children}
        </ResourcesContext.Provider>
    )
}
export const useResourcesContext = () => useContext(ResourcesContext)
