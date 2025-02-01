import { 
	transactionModal,
	categoryModal,
	accountModal,
	tagModal,
	EditModal,
} from './modals';
import { useResourcesContext } from './resourcesProvider';
import { 
	AccountIcon,
	CategoryIcon,
	TransactionIcon,
	TagIcon,
} from '../icons';


export const Utils = () => {

	const { 
		setTransactions,
		setAccounts,
		setCategories,
		setTags,
		filter,
		db,
	} = useResourcesContext()
	const { app, plugin } = db

	const addTransaction = (data: any) => {
		const { byAccount, byCategory, byTag, byMonth, byYear } = filter
		const { transaction } = data

		if (byAccount > 0 && byAccount != transaction.account_id)
			return
		if (byCategory > 0 && byCategory != transaction.category_id) 
			return
		if (byTag > 0 && byTag != transaction.tag_id)
			return
		if (byMonth != null && Number(byMonth.split('-')[1]) != new Date(transaction.date).getMonth() + 1)
			return
		if (byYear != new Date(transaction.date).getFullYear())
			return

		setTransactions((prev: any) => {
			let newTransactions = [...prev, data]
			newTransactions.sort((a: any, b: any) => new Date(b.transaction.date).getTime() - new Date(a.transaction.date).getTime())
			return newTransactions 
		})
	}

	const setState = (state: any, data: any) => {
		if (data.delete) {
			state((prev: any) => prev.filter((item: any) => item.id != data.delete));
		}
		else if (data.update) {
			state((prev: any) => prev.map((item: any) => {
				if (item.id == data.update.id)
            	    item = data.update
            	return item
			}))
		}
		else state((prev: any) => [...prev, data])
	}
	return (
		<div style={{display: 'inline'}}>
			<button
				title="Add account"
				onClick={() => {
					const modal = new EditModal(app, plugin.database, accountModal, (data) => setState(setAccounts, data))
					modal.load()
					modal.open()
				}}>
				<AccountIcon/>	
			</button>
			<button
				title="Add category"
				onClick={() => {
					const modal = new EditModal(app, plugin.database, categoryModal, (data) => setState(setCategories, data))
					modal.load()
					modal.open()
				}}>
				<CategoryIcon/>
			</button>
			<button
				title="Add transaction"
				onClick={() => {
					const modal = new EditModal(app, plugin.database, transactionModal, (data) => addTransaction(data))
					modal.load()
					modal.open()
				}}>
				<TransactionIcon/>	
			</button>
			<button
				title="Add tag"
				onClick={() => {
					const modal = new EditModal(app, plugin.database, tagModal, (data) => setState(setTags, data))
					modal.load()
					modal.open()
				}}>
				<TagIcon/>
			</button>
		</div>
	);
}
