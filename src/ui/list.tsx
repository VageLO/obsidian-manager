import React from 'react';
import { EditModal } from './modal';

export const List = ({ transactions, db }) => {
	const { app, plugin } = db
    return (
		<div style={{margin: '10px'}}>
            {transactions.map((transaction) => {
                return (
					<div className="transaction-card">
						<p className="account">{transaction.from_account}</p>
                    	<p className="amount">{transaction.amount} {transactions.from_account_currency}</p>
                    	<p className="date">{transaction.date}</p>
                    	<p className="operation-type">{transaction.operation_type}</p>

						<button key={transaction.id} onClick={(e) => {
							new EditModal(app, plugin.database, transaction).open()
						}}>
							Edit
						</button>	
					</div>
				)
			})}
			
		</div>
	);
};
