import { ManagerDatabase } from '..';
import { createObjFromArray } from './dbHelpers';

export async function listTransactions(this: ManagerDatabase) {
    const res = this.db.exec(`SELECT 
Transactions.*,
Accounts.title as 'from_account',
Accounts.currency as 'from_account_currency',
NULL as 'to_account',
NULL as 'to_account_currency',
Categories.title as 'category'
FROM Transactions 
INNER JOIN Categories ON Categories.id = Transactions.category_id
INNER JOIN Accounts ON Accounts.id = Transactions.account_id WHERE Transactions.to_account_id IS NULL

UNION ALL

SELECT
Transactions.*,
from_account.title as 'from_account',
from_account.currency as 'from_account_currency',
to_account.title as 'to_account',
to_account.currency as 'to_account_currency',
Categories.title as 'category'
FROM Transactions 
INNER JOIN Categories ON Categories.id = Transactions.category_id
INNER JOIN Accounts as from_account ON from_account.id = Transactions.account_id
INNER JOIN Accounts as to_account ON to_account.id = Transactions.to_account_id
WHERE Transactions.to_account_id IS NOT NULL
ORDER BY Transactions.date DESC;`)
	
	const transactions = createObjFromArray(res[0])

    return transactions
}
