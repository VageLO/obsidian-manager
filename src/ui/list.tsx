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

    useEffect(() => {
		console.log('use', transactions)
	}, [transactions, mult])

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

            {transactions.map((t, index) => {
                return (
					<div className="transaction-card" key={t.transaction.id}>
						<div className="account">
                            <p style={colorAccount(t.transaction)}>
                                {t.from_account.title}
                            </p>
                            <p>{t.to_account ? " > " : ""}</p>
                            <p style={colorAccount(t.transaction, t.transaction.to_account_id)}>
                                {t.to_account ? t.to_account.title : ""}
                            </p>
                        </div>
						<div className="amount">
						    <p style={colorAmount(t.transaction)}>
						        {t.transaction.amount + " " + t.from_account.currency}
						    </p>
						    <p>{t.transaction.to_amount > 0 ? " > " : ""}</p>
						    <p style={colorAmount(t.transaction, t.transaction.to_account_id)}>
						        {t.transaction.to_amount > 0 ? t.transaction.to_amount + 
						            " " + t.to_account.currency : ""}
						    </p>
						</div>
						<p className="date">{t.transaction.date}</p>
						<p className="operation-type">{t.transaction.transaction_type}</p>
						<p className="desc">{t.transaction.description}</p>

						{!mult ? <button
                            title="Edit"
                            onClick={(e) => {
							    const modal = new EditModal(app, plugin.database, transactionModal, 
                                    (data) => callback(data))
								modal.load(t.transaction)
								modal.open()
						    }}
                        >
						    📝
						</button> : ""}
						{!mult ? <button
                            title="Delete"
                            onClick={async(e) => {
                                await db.deleteTransactions([t.transaction.id])
                                removeFromState(t.transaction.id)
						    }}
                        >
						    🚽
						</button> : ""}

                        {mult ?
                        <input
                            type="checkbox"
                            name="cb_transaction" 
                            id={t.transaction.id}
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
