import { 
    React,
    useState,
    useEffect,
    useContext,
} from 'react';
import { 
    transactionModal,
    EditModal,
} from './modals';
import { useResourcesContext } from './resourcesProvider';
import { Utils } from './utils';

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

    const { transactions, setTransactions, db } = useResourcesContext()
	const { app, plugin } = db

    const [transactionId, setTransactionId] = useState([])

    const [mult, setMult] = useState(false)

    useEffect(() => {}, [transactions, mult])

    const removeFromState = (id) => {
        setTransactions(prev => prev.filter((item, _) => item.id != id));
    }
    const callback = (data: any) => {
        const t = transactions.map((item, _) => {
            if (item.id == data.id) {
                item = data
            }
            return item
        })
        setTransactions(t)
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
                    await db.deleteTransactions([transactionId])
                    console.log(transactionId)
                    console.log(transactions)
                    transactionId.forEach((id) => {
                        removeFromState(id)
                    })
					setMult(false)
			    }}>
			    🚽
			</button> : ""}

			<Utils/>

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

						{!mult ? <button
                            title="Edit"
                            onClick={(e) => {
							    const modal = new EditModal(app, plugin.database, transactionModal, 
                                    (data) => callback(data))
								modal.load(transaction)
								modal.open()
						    }}
                        >
						    📝
						</button> : ""}
						{!mult ? <button
                            title="Delete"
                            onClick={async(e) => {
                                await db.deleteTransactions([transaction.id])
                                removeFromState(transaction.id)
						    }}
                        >
						    🚽
						</button> : ""}

                        {mult ?
                        <input
                            type="checkbox"
                            name="cb_transaction" 
                            id={transaction.id}
                            onChange={(e) => {
                                const id = +e.target.id

                                const tId = searchById(transactionId, id)

                                if (e.target.checked) {
                                    transactionId.push(id)
                                    setTransactionId(transactionId)
                                }
                                else if(tId != -1 || tIndex != -1) {
                                    transactionId.splice(tId, 1)
                                    setTransactionId(transactionId)
                                }
                            }}
                        /> : ""}
					</div>
				)
			})}
		</div>
	);
}
