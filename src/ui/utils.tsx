import { React , useState, useEffect, useContext } from 'react';
import { 
    createTransaction,
    createAccount,
    createCategory,
    EditModal,
} from './modals';
import { ResourcesContext } from './view';


export const Utils = () => {

    const { transactions, db } = useContext(ResourcesContext)
	const { app, plugin } = db

    return (
		<>
			<button
                title="add account"
                onClick={(e) => {
					const modal = new EditModal(app, plugin.database, createAccount)
					modal.load()
					modal.open()
				}}>
				+ A
			</button>
			<button
                title="add category"
                onClick={(e) => {
					const modal = new EditModal(app, plugin.database, createCategory)
					modal.load()
					modal.open()
				}}>
				+ C	
			</button>
			<button
                title="add transaction"
                onClick={(e) => {
					const modal = new EditModal(app, plugin.database, createTransaction)
					modal.load()
					modal.open()
				}}>
				+ T
			</button>
		</>
	);
}
