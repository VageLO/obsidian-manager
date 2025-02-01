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

export const List = () => {

    const { transactions, setTransactions, db } = useResourcesContext()
	const { app, plugin } = db

    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
    const [grandTotal, setGrandTotal] = useState({
		type: 'Total',
		total: '',
	})

    const [mult, setMult] = useState(false)
    const [selectAll, setSelectAll] = useState(false)

	const [contextMenu, setContextMenu] = useState({
		mouseX: 0,
		mouseY: 0,
		transaction: {},
		clicked: false,
	})

    useEffect(() => {
		console.log('list')
		countTotal(grandTotal.type)
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

	const handleContextMenu = (event: any, transaction: any) => {
		let mouseX: number = event.clientX - 45;
		let mouseY: number = event.clientY - 45;

		const leaf = db.app.workspace.getLeavesOfType('file-explorer')[0];
		if (!leaf.parent.parent.collapsed) {
			const navEl = leaf.view.containerEl.querySelector('.nav-files-container');
			const rect = navEl.getBoundingClientRect();
			mouseX -= rect.width
		}

		event.preventDefault();

		if (!contextMenu.clicked) {
			const newContext = {
				mouseX: mouseX,
				mouseY: mouseY,
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

	const deleteSelected = async() => {
		const ids = []

		for (const [key, value] of Object.entries(checkedItems)) {
			if (value)
				ids.push(key)
		}

		if (ids.length) {
			await db.deleteTransactions(ids)
			ids.forEach(id => removeFromState(id))
		}
		setSelectAll(false)
		setCheckedItems({})
		setMult(false)
	}

	const handleSelect = (event: BaseSyntheticEvent) => {
		const { name, checked } = event.target
		setCheckedItems({...checkedItems, [name]: checked})	
	}

	const handleSelectAll = (event: BaseSyntheticEvent) => {
		const { checked } = event.target
		setSelectAll(checked)
		const updatedCheckedItems = transactions.reduce((acc: any, item: any) => {
			acc[item.transaction.id] = checked;
			return acc;
		}, {})
		setCheckedItems(updatedCheckedItems)
	}

	const countTotal = (type: string) => {
		let res = `${type}: `
		const count = transactions.reduce((acc: any, t: any) => {
			const { transaction, from_account } = t
			const currency = from_account.currency;
			const amount = Number.parseFloat(transaction.amount);

			if (!acc[currency] && transaction.transaction_type != "Transfer") {
				acc[currency] = {
					"Withdrawal": 0,
					"Deposit": 0,
					"Total": 0,
				};
			}

			if (transaction.transaction_type == "Withdrawal") {
				acc[currency]["Withdrawal"] -= amount;
				acc[currency]["Total"] -= amount;
			}
			if (transaction.transaction_type == "Deposit") {
				acc[currency]["Deposit"] += amount;
				acc[currency]["Total"] += amount;
			}
			return acc;
		}, {});

		Object.keys(count).forEach(key => {
			res += `${count[key][type].toFixed(2)} ${key}; `
		});

		setGrandTotal({ type: type, total: res })
	}

    return (
		<div>
			<button
        	    title="Select transactions"
        	    onClick={() => {
					setCheckedItems({})
					setMult(!mult)}}>
				{mult ? <MultiSelectCloseIcon/> : <MultiSelectIcon/>}
			</button>

        	{mult ?
        	<button
        	    title="Delete selected"
        	    onClick={deleteSelected}>
				<DeleteIcon/>
			</button> : ""}

			<Utils/>

			<table className="table">
				<thead>
					<tr>
						{mult ?
						<th className="cell" scope="col">
							<input
                        	    type="checkbox"
                        	    name="cb_transaction"
								checked={selectAll}
								onChange={handleSelectAll}/>
						</th> : ""}
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
                        	    name={t.transaction.id}
								checked={checkedItems[t.transaction.id] ?? false}
								onChange={handleSelect}/>
						</td> : ""}
						<th className="fixed-width" scope="row">{t.transaction.date}</th>

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

						<td className="fixed-width">{t.transaction.description}</td>
					</tr>
				)
			})}
				</tbody>
				<tfoot>
					<tr>
						<td colSpan={2} className="cell">
							<select
								defaultValue={grandTotal.type}
								onChange={(e) => countTotal(e.target.value)}
							>
								<option>Total</option>
								<option>Withdrawal</option>
								<option>Deposit</option>
							</select>
						</td>
						<td colSpan={7} className="cell">{grandTotal.total}</td>
					</tr>
				</tfoot>
			</table>
			{contextMenu.clicked &&
				<ul 
				  className="context-menu" 
				  style={{
					left: contextMenu.mouseX,
					top: contextMenu.mouseY,
				  }}
				>
				  <li onClick={() => handleEditTransaction(contextMenu.transaction)}>Edit Transaction</li>
				  <li onClick={async() => {
					await db.deleteTransactions([(contextMenu.transaction as any).id])
					removeFromState((contextMenu.transaction as any).id)}}>Delete Transaction</li>
				</ul>}
		</div>
	);
}
