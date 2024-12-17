export const allTransactions = (substring: string) : string => {
return `
SELECT 
Transactions.id as 'transaction.id',
Transactions.account_id as 'transaction.account_id',
Transactions.category_id as 'transaction.category_id',
Transactions.to_account_id as 'transaction.to_account_id',
Transactions.tag_id as 'transaction.tag_id',
Transactions.transaction_type as 'transaction.transaction_type',
Transactions.date as 'transaction.date',
Transactions.amount as 'transaction.amount',
Transactions.to_amount as 'transaction.to_amount',
Transactions.description as 'transaction.description',

from_account.id as 'from_account.id',
from_account.title as 'from_account.title',
from_account.currency as 'from_account.currency',
from_account.balance as 'from_account.balance',

coalesce(to_account.id, NULL) as 'to_account.id',
coalesce(to_account.title, NULL) as 'to_account.title',
coalesce(to_account.currency, NULL) as 'to_account.currency',
coalesce(to_account.balance, NULL) as 'to_account.balance',

category.id as 'category.id',
category.parent_id as 'category.parent_id',
category.title as 'category.title',

coalesce(tag.id, NULL) as 'tag.id',
coalesce(tag.title, NULL) as'tag.title'

FROM Transactions
LEFT JOIN Categories as category ON category.id = Transactions.category_id
LEFT JOIN Accounts as from_account ON from_account.id = Transactions.account_id
LEFT JOIN Accounts as to_account ON to_account.id = Transactions.to_account_id
LEFT JOIN Tags as tag ON tag.id = Transactions.tag_id
${substring}
ORDER BY Transactions.date DESC;
`
}
