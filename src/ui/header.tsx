import { useResourcesContext } from './resourcesProvider';
import { useState, useEffect } from 'react'

export const Header = () => {
    const { accounts, categories, setTransactions, db } = useResourcesContext()

	const [byAccount, setByAccount] = useState(0)
	const [byCategory, setByCategory] = useState(0)

	useEffect(() => {
		const fetchData = async() => {
			setTransactions(await db.listTransactions(byAccount, byCategory))
		}
		if (byAccount || byCategory) {
			fetchData()
		}
	}, [byAccount, byCategory, accounts, categories])

    return (
		<div>
            <select
				onChange={(e) => {
					const id = e.target.options[e.target.selectedIndex].id
					setByAccount(+id)
				}}
			>
                <option defaultValue="" disable="true" hidden>Accounts</option>
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
                <option defaultValue="" disable="true" hidden>Categories</option>
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
