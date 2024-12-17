import { 
    useState,
    useEffect,
} from 'react';
import { 
    transactionModal,
    EditModal,
} from './modals';
import { useResourcesContext } from './resourcesProvider';
import { Utils } from './utils';
import { 
	MultiSelectIcon,
	MultiSelectCloseIcon,
	DeleteIcon,
	EditIcon,
} from '../icons';

const success_color = "var(--text-success)"
const error_color = "var(--text-error)"

const colorAccount = (transaction: any, to_account_id: number) => {
    if(transaction.transaction_type == 'Deposit')
        return { color: success_color }
    if(to_account_id)
        return { color: success_color }
    return { color: error_color }
}

const colorAmount = (transaction: any, to_account_id: number) => {
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

    const removeFromState = (id: any) => {
        setTransactions((prev: any) => prev.filter((item: any) => item.transaction.id != id));
    }

    const callback = (data: any) => {
        const t = transactions.map((item: any) => {
            if (item.transaction.id == data.transaction.id) {
                item = data
            }
            return item
        })
        setTransactions(t)
    }

    return (
		<div>
			<button
        	    title="Select transactions"
        	    onClick={() => setMult(!mult)}>
				{mult ? <MultiSelectCloseIcon/> : <MultiSelectIcon/>}
			</button>

        	{mult ?
        	<button
        	    title="Delete selected"
        	    onClick={async() => {
        	        await db.deleteTransactions(transactionId)
        	        transactionId.forEach((id) => {
        	            removeFromState(id)
        	        })
					setMult(false)
			    }}>
				<DeleteIcon/>
			</button> : ""}

			<Utils/>

            {transactions.map((t: any) => {
                return (
					<div className="transaction-card" key={t.transaction.id}>
						<div>
							<div className="account">
                        	    <p style={colorAccount(t.transaction, 0)}>
                        	        {t.from_account.title}
                        	    </p>
								{t.to_account ? <p>{' > '}</p> : ""}
								{t.to_account ? <p style={colorAccount(t.transaction, t.transaction.to_account_id)}>
                        	        {t.to_account ? t.to_account.title : ""}
                        	    </p> : ""}
                        	</div>
							<div className="amount">
							    <p style={colorAmount(t.transaction, 0)}>
							        {t.transaction.amount + " " + t.from_account.currency}
							    </p>
								{t.transaction.to_amount > 0 ? <p>{" > "}</p> : ""}
								{t.transaction.to_amount > 0 ? 
								<p style={colorAmount(t.transaction, t.transaction.to_account_id)}>
							        {t.transaction.to_amount + 
							            " " + t.to_account.currency}
							    </p> : ""}
							</div>
							<p className="date">{t.transaction.date}</p>
							<p className="operation-type">{t.transaction.transaction_type}</p>
							{t.tag ? <p className="desc">{t.tag.title}</p> : ""}
							<p className="desc">{t.transaction.description}</p>
						</div>
						<div style={{display: 'grid'}}>
							{!mult ? <button
                        	    title="Edit"
                        	    onClick={() => {
								    const modal = new EditModal(app, plugin.database, transactionModal, 
                        	            (data) => callback(data))
									modal.load(t.transaction)
									modal.open()
							    }}
                        	>
								<EditIcon/>
							</button> : ""}
							{!mult ? <button
                        	    title="Delete"
                        	    onClick={async() => {
                        	        await db.deleteTransactions([t.transaction.id])
                        	        removeFromState(t.transaction.id)
							    }}
                        	>
								<DeleteIcon/> 
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
                        	        else if(tId != -1) {
                        	            transactionId.splice(tId, 1)
                        	            setTransactionId(transactionId)
                        	        }
                        	    }}
                        	/> : ""}
						</div>
					</div>
				)
			})}
		</div>
	);
}
