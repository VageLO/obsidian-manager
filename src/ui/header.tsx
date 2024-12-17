import { useResourcesContext } from './resourcesProvider';
import { useState, useEffect } from 'react'

export const Header = () => {
    const { accounts, categories, tags, setTransactions, db } = useResourcesContext()

	const [byAccount, setByAccount] = useState(null)
	const [byCategory, setByCategory] = useState(null)
	const [byTag, setByTag] = useState(null)

	useEffect(() => {
		const fetchData = async(account: any, category: any, tag: any) => {
			setTransactions(await db.listTransactions(account, category, tag))
		}
		if (byAccount || byCategory || byTag)
			fetchData(byAccount, byCategory, byTag)
		else if (byAccount == 0 || byCategory == 0 || byTag == 0)
			fetchData(byAccount, byCategory, byTag)

	}, [
			byAccount,
			byCategory,
			byTag,
			accounts,
			categories,
			tags
		])

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
			<select
				onChange={(e) => {
					const id = e.target.options[e.target.selectedIndex].id
					setByTag(+id)
				}}
			>
                <option id={'0'}>All Tags</option>
		        {tags.map((tag: any) => (
                    <option 
						key={tag.id}
						id={tag.id}
					>
                        {tag.title}
                    </option>
                ))}
            </select>
		</div>
	);
};
