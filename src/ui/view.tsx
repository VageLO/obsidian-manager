import { StrictMode } from 'react';
import { ItemView, WorkspaceLeaf } from 'obsidian';
import { Root, createRoot } from 'react-dom/client';
import { Header } from './header';
import { List } from './list';
import { ManagerDatabase } from '../database';

export const VIEW_TYPE_EXAMPLE = 'example-view';

export class ExampleView extends ItemView {
	root: Root | null = null;

	constructor(leaf: WorkspaceLeaf, db: ManagerDatabase) {
		super(leaf);
        this.db = db
	}

	getViewType() {
		return VIEW_TYPE_EXAMPLE;
	}

	getDisplayText() {
		return 'Example view';
	}

	async onOpen() {
		this.root = createRoot(this.containerEl.children[1]);
		this.root.render(
			<StrictMode>
				<Header
                    accounts={await this.db.listAccounts()}
                    categories={await this.db.listCategories()}
                />
                <List
                    transactions={await this.db.listTransactions()}
                />
			</StrictMode>,
		);
	}

	async onClose() {
		this.root?.unmount();
	}
}
