import { 
    useState,
    useEffect,
    BaseSyntheticEvent,
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
	const [contextMenu, setContextMenu] = useState({
		mouseX: 0,
		mouseY: 0,
		transaction: {},
		clicked: false,
	})

    useEffect(() => {
		console.log('list')
		if (contextMenu.clicked) {
			document.addEventListener('click', handleClose)
			return () => {
				document.removeEventListener('click', handleClose)
			}
		}
	}, [transactions, mult, contextMenu])

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

	const handleContextMenu = (event: BaseSyntheticEvent, transaction: any) => {
		event.preventDefault();
		if (!contextMenu.clicked) {
			const newContext = {
				mouseX: event.clientX - 345,
				mouseY: event.clientY - 60,
				transaction: transaction,
				clicked: true,
			}
			setContextMenu(newContext)
		} 
	};

	const handleClose = () => {
		setContextMenu(prev => ({...prev, clicked: false}));
	};

	const handleEditTransaction = (transaction: any) => {
		const modal = new EditModal(app, plugin.database, transactionModal, 
        (data) => callback(data))
		modal.load(transaction)
		modal.open()
		handleClose();
	};

	const multiSelectHandler = (e) => {
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
	}

    return (
		<div>
			<button
        	    title="Select transactions"
        	    onClick={() => {
					setTransactionId([])
					setMult(!mult)}}>
				{mult ? <MultiSelectCloseIcon/> : <MultiSelectIcon/>}
			</button>

        	{mult ?
        	<button
        	    title="Delete selected"
        	    onClick={async() => {
					if (transactionId.length != 0) {
						await db.deleteTransactions(transactionId)
        	        	transactionId.forEach((id) => {
        	        	    removeFromState(id)
        	        	})
					}
					setMult(false)
			    }}>
				<DeleteIcon/>
			</button> : ""}

			<Utils/>

			<table>
				<thead>
					<tr>
						{mult ?
						<th className="cell" scope="col"></th> : ""}
						<th className="cell" scope="col">Date</th>
						<th className="cell" scope="col">Account</th>
						<th className="cell" scope="col">To Account</th>
						<th className="cell" scope="col">Category</th>
						<th className="cell" scope="col">Tag</th>
						<th className="cell" scope="col">Type</th>
						<th className="cell" scope="col">Amount</th>
						<th className="cell" scope="col">To Amount</th>
						<th className="cell" scope="col">Description</th>
					</tr>
				</thead>
				<tbody>
				{transactions.map((t: any) => {
                return (
					<tr 
						key={t.transaction.id}
						onContextMenu={(e) => handleContextMenu(e, t.transaction)}
					>
						{mult ?
						<td className="cell">
							<input
                        	    type="checkbox"
                        	    name="cb_transaction" 
                        	    id={t.transaction.id}
								onChange={(e) => multiSelectHandler(e)}/>
						</td> : ""}
						<th className="cell" scope="row">{t.transaction.date}</th>

						{t.from_account ? <td className="fixed-width" style={colorAccount(t.transaction, 0)}>{t.from_account.title}</td> : 
							<td className="fixed-width"></td>}

						{t.to_account ? 
							<td className="fixed-width" style={colorAccount(t.transaction, t.transaction.to_account_id)}>
								{t.to_account.title}
							</td> : <td className="cell"></td>}

						{t.category ? <td className="cell">{t.category.title}</td> : <td className="cell"></td>}

						{t.tag ? <td className="cell">{t.tag.title}</td> : <td className="cell"></td>}

						<td className="cell">{t.transaction.transaction_type}</td>

						<td className="cell" style={colorAmount(t.transaction, 0)}>
							{t.transaction.amount + " " + t.from_account.currency}
						</td>

						{t.transaction.to_amount > 0 ? 
							<td className="cell" style={colorAmount(t.transaction, t.transaction.to_account_id)}>
								{t.transaction.to_amount + 
									" " + t.to_account.currency}
							</td> : <td className="cell"></td>}

						<td className="cell">{t.transaction.description}</td>
					</tr>
				)
			})}
				</tbody>
			</table>
			{contextMenu.clicked &&
				<ul 
				  className="context-menu" 
				  style={{
					position: 'fixed',
					left: contextMenu.mouseX + 'px',
					top: contextMenu.mouseY + 'px'
				  }}
				>
				  <li onClick={() => handleEditTransaction(contextMenu.transaction)}>Edit Transaction</li>
				  <li onClick={async() => {
					await db.deleteTransactions([contextMenu.transaction.id])
                    removeFromState(contextMenu.transaction.id)}}>Delete Transaction</li>
				</ul>}
		</div>
	);
}
