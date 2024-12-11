import { React , useEffect } from 'react';
import { 
	transactionModal,
	createAccount,
	createCategory,
	EditModal,
} from './modals';
import { useResourcesContext } from './resourcesProvider';


export const Utils = () => {

	const { setTransactions, db } = useResourcesContext()
	const { app, plugin } = db

	const addTransaction = (data: any) => {
		setTransactions((prev) => [...prev, data])
	}

	return (
		<>
			<button
				title="add account"
				onClick={() => {
					const modal = new EditModal(app, plugin.database, createAccount)
					modal.load()
					modal.open()
				}}>
				+ A
			</button>
			<button
				title="add category"
				onClick={() => {
					const modal = new EditModal(app, plugin.database, createCategory)
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
		</>
	);
}
