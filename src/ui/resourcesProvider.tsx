import { createContext, useEffect, useContext, useState, useCallback } from 'react';

export const ResourcesContext = createContext();

export const ResourceProvider = ({children, db}) => {

    const [transactions, setTransactions] = useState([])
    const [accounts, setAccounts] = useState([])
    const [categories, setCategories] = useState([])
    //const [loading, setLoading] = useState(true)
    
    const setResources = useCallback(async() => {
        setTransactions(await db.listTransactions())
        setAccounts(await db.listAccounts())
        setCategories(await db.listCategories())
    }, [])

    useEffect(() => {
        setResources()
    }, [setResources])

    const resources = {
        db: db,
        transactions: transactions,
        setTransactions: setTransactions,
        categories: categories,
        setCategories: setCategories,
        accounts: accounts,
        setAccounts: setAccounts,
    }

    return (
        <ResourcesContext.Provider value={resources}>
            {children}
        </ResourcesContext.Provider>
    )
}
export const useResourcesContext = () => useContext(ResourcesContext)
