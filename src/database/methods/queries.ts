// TODO: refine

export const allTransactions = `
SELECT 
Transactions.id as 'transaction.id',
Transactions.account_id as 'transaction.account_id',
Transactions.category_id as 'transaction.category_id',
Transactions.to_account_id as 'transaction.to_account_id',
Transactions.transaction_type as 'transaction.transaction_type',
Transactions.date as 'transaction.date',
Transactions.amount as 'transaction.amount',
Transactions.to_amount as 'transaction.to_amount',
Transactions.description as 'transaction.description',

from_account.id as 'from_account.id',
from_account.title as 'from_account.title',
from_account.currency as 'from_account.currency',
from_account.balance as 'from_account.balance',

NULL as 'to_account.id',
NULL as 'to_account.title',
NULL as 'to_account.currency',
NULL as 'to_account.balance',

category.id as 'category.id',
category.parent_id as 'category.parent_id',
category.title as 'category.title'

FROM Transactions
INNER JOIN Categories as category ON category.id = Transactions.category_id
INNER JOIN Accounts as from_account ON from_account.id = Transactions.account_id 
WHERE Transactions.to_account_id IS NULL

UNION ALL

SELECT
Transactions.*,
from_account.*,
to_account.*,
category.*
FROM Transactions 
INNER JOIN Categories as category ON category.id = Transactions.category_id
INNER JOIN Accounts as from_account ON from_account.id = Transactions.account_id
INNER JOIN Accounts as to_account ON to_account.id = Transactions.to_account_id
WHERE Transactions.to_account_id IS NOT NULL
ORDER BY Transactions.date DESC;
`

export const getTransactionById = `
SELECT 
Transactions.id as 'transaction.id',
Transactions.account_id as 'transaction.account_id',
Transactions.category_id as 'transaction.category_id',
Transactions.to_account_id as 'transaction.to_account_id',
Transactions.transaction_type as 'transaction.transaction_type',
Transactions.date as 'transaction.date',
Transactions.amount as 'transaction.amount',
Transactions.to_amount as 'transaction.to_amount',
Transactions.description as 'transaction.description',

from_account.id as 'from_account.id',
from_account.title as 'from_account.title',
from_account.currency as 'from_account.currency',
from_account.balance as 'from_account.balance',

NULL as 'to_account.id',
NULL as 'to_account.title',
NULL as 'to_account.currency',
NULL as 'to_account.balance',

category.id as 'category.id',
category.parent_id as 'category.parent_id',
category.title as 'category.title'

FROM Transactions
INNER JOIN Categories as category ON category.id = Transactions.category_id
INNER JOIN Accounts as from_account ON from_account.id = Transactions.account_id 
WHERE Transactions.to_account_id IS NULL AND Transactions.id = ?

UNION ALL

SELECT
Transactions.*,
from_account.*,
to_account.*,
category.*
FROM Transactions 
INNER JOIN Categories as category ON category.id = Transactions.category_id
INNER JOIN Accounts as from_account ON from_account.id = Transactions.account_id
INNER JOIN Accounts as to_account ON to_account.id = Transactions.to_account_id
WHERE Transactions.to_account_id IS NOT NULL AND Transactions.id = ?
ORDER BY Transactions.date DESC;
`
