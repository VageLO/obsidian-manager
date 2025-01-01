import { ItemView, WorkspaceLeaf } from 'obsidian';
import { Root, createRoot } from 'react-dom/client';
import { Tabs } from './tabs';
import { ResourceProvider } from './resourcesProvider';
import { ManagerDatabase } from 'database';
import { ManagerAPIDatabase } from 'api';

export const VIEW_TYPE = 'manager-view';

export class ManagerView extends ItemView {
	root: Root | null = null;
	db: ManagerDatabase | ManagerAPIDatabase

	constructor(
		leaf: WorkspaceLeaf, 
		db: ManagerAPIDatabase | ManagerDatabase
	) {
		super(leaf);
        this.db = db
	}

	getViewType() {
		return VIEW_TYPE;
	}

	getIcon() {
		return 'dollar';
	}
	getDisplayText() {
		return 'Money manager';
	}

	async onOpen() {
		this.root = createRoot(this.containerEl.children[1]);
		this.root.render(
			<>
                <ResourceProvider db={this.db}>
					<Tabs/>
                </ResourceProvider>
			</>,
		);
	}

	async onClose() {
		this.root?.unmount();
	}
}
