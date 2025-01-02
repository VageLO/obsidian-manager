import { useResourcesContext } from './resourcesProvider';
import { useEffect } from 'react'

export const Header = () => {
	const { 
		accounts,
		categories,
		tags,
		setTransactions,
		filter,
		setFilter,
		db
	} = useResourcesContext()

	useEffect(() => {
		const fetchData = async(account: any, category: any, tag: any) => {
			setTransactions(await db.listTransactions(account, category, tag))
		}
		const { byAccount, byCategory, byTag } = filter
		if (byAccount != null || byCategory != null || byTag != null)
			fetchData(byAccount, byCategory, byTag)
	}, [
			filter,
			accounts,
			categories,
			tags
		])

    return (
		<div>
            <select
				onChange={(e) => {
					const id = e.target.options[e.target.selectedIndex].id
					setFilter((prev: any) => ({...prev, byAccount: +id}))
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
					setFilter((prev: any) => ({...prev, byCategory: +id}))
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
					setFilter((prev: any) => ({...prev, byTag: +id}))
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
