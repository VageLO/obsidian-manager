import { createContext, useEffect, useContext, useState } from 'react';
import { 
	ResourceProviderProps,
	Filter,
	ResourcesContextType,
    Category,
    Account,
    TransactionDetails,
    Tag
} from '../types';

export const ResourcesContext = createContext<ResourcesContextType | undefined>(undefined);

export const ResourceProvider = ({ children, db }: ResourceProviderProps) => {
	const [transactions, setTransactions] = useState<TransactionDetails[]>([]);
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [tags, setTags] = useState<Tag[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [filter, setFilter] = useState<Filter>({
		byAccount: null,
		byCategory: null,
		byTag: null,
		byYear: new Date().getFullYear(),
		byMonth: null,
	});
	const [prevFilter, setPrevFilter] = useState<Filter>(filter);

	const setResources = async () => {
		try {
			setLoading(true);
			const transactionsData = await db.listTransactions(
				null,
				null,
				null,
				null,
				filter.byYear,
				setPrevFilter
			);
			setTransactions(transactionsData);
			setAccounts(await db.listAccounts());
			setCategories(await db.listCategories());
			setTags(await db.listTags());
			setPrevFilter(filter);
		} catch (error) {
			console.error('Error fetching resources:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		setResources();
	}, [filter.byYear]);

	const resources: ResourcesContextType = {
		db,
		transactions,
		setTransactions,
		categories,
		setCategories,
		accounts,
		setAccounts,
		tags,
		setTags,
		filter,
		setFilter,
		prevFilter,
		setPrevFilter,
	};

	if (loading) {
		return <div>Loading</div>;
	}

	return (
		<ResourcesContext.Provider value={resources}>
			{children}
		</ResourcesContext.Provider>
	);
};

export const useResourcesContext = () => {
	const context = useContext(ResourcesContext);
	if (context === undefined) {
		throw new Error('useResourcesContext must be used within a ResourceProvider');
	}
	return context;
};
