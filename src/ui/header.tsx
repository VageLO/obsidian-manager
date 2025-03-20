import { useResourcesContext } from './resourcesProvider';
import { BaseSyntheticEvent, useEffect } from 'react'

export const Header = () => {
	const { 
		accounts,
		categories,
		tags,
		setTransactions,
		filter,
		setFilter,
		prevFilter,
		setPrevFilter,
		db
	} = useResourcesContext()

	useEffect(() => {
		const fetchData = async(
			account: any,
			category: any,
			tag: any,
			month: string | null,
			year: any,
		) => {
			setTransactions(await db.listTransactions(account, category, tag, month, year, setPrevFilter))
		}
		const { byAccount, byCategory, byTag, byMonth, byYear } = filter

		// TODO: horrible 🙀, maybe need refactoring.
		if (byAccount != prevFilter.byAccount ||
			byCategory != prevFilter.byCategory ||
			byTag != prevFilter.byTag ||
			byMonth != prevFilter.byMonth ||
			byYear != prevFilter.byYear
		)
			fetchData(byAccount, byCategory, byTag, byMonth, byYear)
	}, [
			filter,
			accounts,
			categories,
			tags
		])

    return (
		<div>
            <select
				title='Sort by account'
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
				title='Sort by category'
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
				title='Sort by tag'
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
			{/* TODO: style */}
			<input 
				type={'month'}
				title='Sort by month'
				onInput={(e: BaseSyntheticEvent) => {
					const month = e.target.value
					setFilter((prev: any) => ({...prev, byMonth: month}))
				}}
			/>
			<input 
				title='Sort by year'
				placeholder="YYYY"
				type={'number'}
				defaultValue={filter.byYear}
				max={2099}
				min={1900}
				onBlur={(e: BaseSyntheticEvent) => {
					const year = e.target.value
					setFilter((prev: any) => ({...prev, byYear: year}))
				}}
			/>
		</div>
	);
};
