import { StrictMode, createContext } from 'react';
import { ItemView, WorkspaceLeaf } from 'obsidian';
import { Root, createRoot } from 'react-dom/client';
import { Header } from './header';
import { List } from './list';
import { ManagerDatabase } from '../database';

export const VIEW_TYPE = 'manager-view';
export const ResourcesContext = createContext(null);

export class ManagerView extends ItemView {
	root: Root | null = null;

	constructor(leaf: WorkspaceLeaf, db: ManagerDatabase) {
		super(leaf);
        this.db = db
	}

	getViewType() {
		return VIEW_TYPE;
	}

	getDisplayText() {
		return 'Money manager';
	}

	async onOpen() {
		this.root = createRoot(this.containerEl.children[1]);
        const resources = {
            db: this.db,
            transactions: await this.db.listTransactions(),
            categories: await this.db.listCategories(),
            accounts: await this.db.listAccounts(),
        }
		this.root.render(
			<StrictMode>
                <ResourcesContext.Provider value={resources}>
				    <Header/>
                    <List/>
                </ResourcesContext.Provider>
			</StrictMode>,
		);
	}

	async onClose() {
		this.root?.unmount();
	}
}
