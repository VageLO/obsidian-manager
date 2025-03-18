import ManagerPlugin from 'main';
import { App } from 'obsidian';
import { Dispatch, SetStateAction, ReactNode } from 'react';
import { Database } from 'sql.js';

export interface CustomError {
	error?: boolean;
	detail?: any;
}

export interface TransactionDetails {
	transaction: Transaction;
	from_account: Account;
	to_account: Account | null;
	category: Category;
	tag: Tag | null;
}

export interface Transaction {
	id?: number;
	account_id: number | null;
	to_account_id: number | null;
	category_id: number | null;
	tag_id: number | null;
	date: string;
	description: string,
	transaction_type: string;
	amount: number | null;
	to_amount: number | null;
}

export interface Account {
	id: number | null;
	title: string | null;
	currency: string | null;
	balance: number;
}

export interface Category {
	id: number | null;
	parent_id: number | null;
	title: string | null;
}

export interface Tag {
	id: number | null;
	title: string | null;
}

export interface ModalData {
	transaction?: Transaction;
	delete?: number;
	update?: Account | Category | Tag | Transaction;
}

export interface Methods {
	// Transactions
	listTransactions: (
		account?: any,
		category?: any,
		tag?: any,
		month?: any,
		year?: number,
		state?: any
	) => Promise<TransactionDetails[]>;
	insertTransaction: (transaction: Transaction) => Promise<TransactionDetails | CustomError>;
	updateTransaction: (transaction: Transaction) => Promise<TransactionDetails | CustomError>;
	deleteTransactions(ids: number[]): Promise<boolean>;
	// Accounts
	listAccounts: () => Promise<Account[]>;
	createAccount: (account: Account) => Promise<Account | CustomError>;
	updateAccount: (account: Account) => Promise<Account | CustomError>;
	deleteAccount: (id: number) => Promise<number>;
	// Categories
	listCategories: () => Promise<Category[]>;
	createCategory: (category: Category) => Promise<Category | CustomError>;
	updateCategory: (category: Category) => Promise<Category | CustomError>;
	deleteCategory: (id: number) => Promise<number>;
	// Tags
	listTags: () => Promise<Tag[]>;
	createTag: (tag: Tag) => Promise<Tag | CustomError>;
	updateTag: (tag: Tag) => Promise<Tag | CustomError>;
	deleteTag: (id: number) => Promise<number>;
}

export interface DatabaseInterface {
	plugin: ManagerPlugin;
    app: App;
    db?: Database;
	apiURL?: string;
	project?: string;
	initialize(): Promise<void | Error>;
	// Transactions
	listTransactions: (
		account?: any,
		category?: any,
		tag?: any,
		month?: any,
		year?: number,
		state?: any
	) => Promise<TransactionDetails[]>;
	insertTransaction: (transaction: Transaction) => Promise<TransactionDetails | CustomError>;
	updateTransaction: (transaction: Transaction) => Promise<TransactionDetails | CustomError>;
	deleteTransactions(ids: number[]): Promise<boolean>;
	// Accounts
	listAccounts: () => Promise<Account[]>;
	createAccount: (account: Account) => Promise<Account | CustomError>;
	updateAccount: (account: Account) => Promise<Account | CustomError>;
	deleteAccount: (id: number) => Promise<number>;
	// Categories
	listCategories: () => Promise<Category[]>;
	createCategory: (category: Category) => Promise<Category | CustomError>;
	updateCategory: (category: Category) => Promise<Category | CustomError>;
	deleteCategory: (id: number) => Promise<number>;
	// Tags
	listTags: () => Promise<Tag[]>;
	createTag: (tag: Tag) => Promise<Tag | CustomError>;
	updateTag: (tag: Tag) => Promise<Tag | CustomError>;
	deleteTag: (id: number) => Promise<number>;
}

export interface Filter {
	byAccount: number | null;
	byCategory: number | null;
	byTag: number | null;
	byMonth: string | null;
	byYear: number;
}

export interface ResourceProviderProps {
	children: ReactNode;
	db: DatabaseInterface;
}

export interface ResourcesContextType {
	db: DatabaseInterface; 
	transactions: TransactionDetails[];
	setTransactions: Dispatch<SetStateAction<TransactionDetails[]>>;
	categories: Category[];
	setCategories: Dispatch<SetStateAction<Category[]>>;
	accounts: Account[];
	setAccounts: Dispatch<SetStateAction<Account[]>>;
	tags: Tag[];
	setTags: Dispatch<SetStateAction<Tag[]>>;
	filter: Filter;
	setFilter: Dispatch<SetStateAction<Filter>>;
	prevFilter: Filter;
	setPrevFilter: Dispatch<SetStateAction<Filter>>;
}
