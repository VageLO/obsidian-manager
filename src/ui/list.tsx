import React from 'react';

export const List = ({ transactions }) => {
    transactions = transactions[0]
    console.log(transactions)
    return (
		<div style={{margin: '10px'}}>
            {transactions.values.map((item) => (
                <div className="transaction-card">
                    <p className="account">{item[9]}</p>
                    <p className="amount">{item[6]}</p>
                    <p className="date">{item[5]}</p>
                    <p className="operation-type">{item[4]}</p>
                </div>
            ))}
		</div>
	);
};
