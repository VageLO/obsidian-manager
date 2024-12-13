import { useResourcesContext } from './resourcesProvider';
import { useState, useEffect } from 'react'

export const Header = () => {
    const { accounts, categories, setTransactions, db } = useResourcesContext()

	const [byAccount, setByAccount] = useState(null)
	const [byCategory, setByCategory] = useState(null)

	useEffect(() => {
		const fetchData = async(account: any, category: any) => {
			setTransactions(await db.listTransactions(account, category))
		}
		if (byAccount || byCategory)
			fetchData(byAccount, byCategory)
		else if (byAccount == 0 || byCategory == 0)
			fetchData(byAccount, byCategory)

	}, [byAccount, byCategory, accounts, categories])

    return (
		<div>
            <select
				onChange={(e) => {
					const id = e.target.options[e.target.selectedIndex].id
					setByAccount(+id)
				}}
			>
                <option id={'0'}>All Accounts</option>
		        {accounts.map((account: any) => (
                    <option 
						key={account.id}
						id={account.id}
						>
                        {account.title}
                    </option>
                ))}
            </select>
            <select
				onChange={(e) => {
					const id = e.target.options[e.target.selectedIndex].id
					setByCategory(+id)
				}}
			>
                <option id={'0'}>All Categories</option>
		        {categories.map((category: any) => (
                    <option 
						key={category.id}
						id={category.id}
					>
                        {category.title}
                    </option>
                ))}
            </select>
		</div>
	);
};
