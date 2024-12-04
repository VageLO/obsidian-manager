import { React , useState, useEffect, useContext } from 'react';
import { EditModal } from './modal';
import { ResourcesContext } from './view';

const success_color = "var(--text-success)"
const error_color = "var(--text-error)"

const colorAccount = (transaction, to_account_id) => {
    if(transaction.transaction_type == 'Deposit')
        return { color: success_color }
    if(to_account_id)
        return { color: success_color }
    return { color: error_color }
}

const colorAmount = (transaction, to_account_id) => {
    if(transaction.transaction_type == 'Deposit')
        return { color: success_color }
    if(to_account_id)
        return { color: success_color }
    return { color: error_color }
}

const searchById = (array: number[], id: number) : number => {
    const index = array.findIndex((item) => item == id) 
    return index
}



export const List = () => {

    const { transactions, db } = useContext(ResourcesContext)
	const { app, plugin } = db

    const [state, setState] = useState(transactions)

    const [transactionId, setTransactionId] = useState([])
    const transactionIndex = []

    const [mult, setMult] = useState(false)

    useEffect(() => {
        console.log('use', state, transactions)
    }, [state, mult])

    const removeFromState = (index) => {
        setState(prev => prev.filter((_, i) => i != index));
    }
    return (
		<div style={{margin: '10px'}}>
            <button
                title="Select many transactions"
                onClick={(e) => setMult(!mult)}>
			    ☰ 
			</button>

            {mult ?
            <button
                title="Delete Selected"
                onClick={async(e) => {
                    //await db.deleteTransactions([transactionId])
                    transactionIndex.forEach((index) => {
                        removeFromState(index)
                    })
			    }}>
			    🚽
			</button> : ""}

            {transactions.map((transaction, index) => {
                return (
					<div className="transaction-card" key={transaction.id}>
						<div className="account">
                            <p style={colorAccount(transaction)}>
                                {transaction.from_account}
                            </p>
                            <p>{transaction.to_account ? " > " : ""}</p>
                            <p style={colorAccount(transaction, transaction.to_account_id)}>
                                {transaction.to_account ? transaction.to_account : ""}
                            </p>
                        </div>
                    	<div className="amount">
                            <p style={colorAmount(transaction)}>
                                {transaction.amount + " " + transaction.from_account_currency}
                            </p>
                            <p>{transaction.to_amount > 0 ? " > " : ""}</p>
                            <p style={colorAmount(transaction, transaction.to_account_id)}>
                                {transaction.to_amount > 0 ? transaction.to_amount + 
                                    " " + transaction.to_account_currency : ""}
                            </p>
                        </div>
                    	<p className="date">{transaction.date}</p>
                    	<p className="operation-type">{transaction.transaction_type}</p>
                    	<p className="desc">{transaction.description}</p>

						<button
                            title="Edit"
                            onClick={(e) => {
							    new EditModal(app, plugin.database, transaction).open()
						    }}
                        >
						    📝
						</button>
                        <button
                            title="Delete"
                            onClick={async(e) => {
                                //await db.deleteTransactions([transaction.id])
                                //setState(transactions.splice(index, 1))
                                removeFromState(index)
						    }}
                        >
						    🚽
						</button>

                        {mult ?
                        <input
                            type="checkbox"
                            name="cb_transaction" 
                            id={transaction.id}
                            onChange={(e) => {
                                const id = +e.target.id

                                const tId = searchById(transactionId, id)
                                const tIndex = searchById(transactionIndex, index)

                                if (e.target.checked) {
                                    transactionId.push(id)
                                    transactionIndex.push(index)
                                    setTransactionId(transactionId)
                                }
                                else if(tId != -1 || tIndex != -1) {
                                    transactionId.splice(tId, 1)
                                    transactionIndex.splice(tIndex, 1)
                                    setTransactionId(transactionId)
                                }
                                //console.log(transactionId, transactionIndex)
                            }}
                        /> : ""}
					</div>
				)
			})}
		</div>
	);
}
