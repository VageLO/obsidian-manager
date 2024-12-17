import { 
	transactionModal,
	categoryModal,
	accountModal,
	tagModal,
	EditModal,
} from './modals';
import { useResourcesContext } from './resourcesProvider';


export const Utils = () => {

	const { 
		setTransactions,
		setAccounts,
		setCategories,
		setTags,
		db,
	} = useResourcesContext()
	const { app, plugin } = db

	const addTransaction = (data: any) => {
		setTransactions((prev: any) => [...prev, data])
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
		<>
			<button
				title="add account"
				onClick={() => {
					const modal = new EditModal(app, plugin.database, accountModal, (data) => setState(setAccounts, data))
					modal.load()
					modal.open()
				}}>
				+ A
			</button>
			<button
				title="add category"
				onClick={() => {
					const modal = new EditModal(app, plugin.database, categoryModal, (data) => setState(setCategories, data))
					modal.load()
					modal.open()
				}}>
				+ C	
			</button>
			<button
				title="add transaction"
				onClick={() => {
					const modal = new EditModal(app, plugin.database, transactionModal, (data) => addTransaction(data))
					modal.load()
					modal.open()
				}}>
				+ T
			</button>
			<button
				title="add tag"
				onClick={() => {
					const modal = new EditModal(app, plugin.database, tagModal, (data) => setState(setTags, data))
					modal.load()
					modal.open()
				}}>
				+ TAG
			</button>
		</>
	);
}
