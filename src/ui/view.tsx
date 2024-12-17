import { StrictMode } from 'react';
import { ItemView, WorkspaceLeaf } from 'obsidian';
import { Root, createRoot } from 'react-dom/client';
import { Tabs } from './tabs';
import { ResourceProvider } from './resourcesProvider';

export const VIEW_TYPE = 'manager-view';

export class ManagerView extends ItemView {
	root: Root | null = null;

	constructor(leaf: WorkspaceLeaf, db) {
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
			<StrictMode>
                <ResourceProvider db={this.db}>
					<Tabs/>
                </ResourceProvider>
			</StrictMode>,
		);
	}

	async onClose() {
		this.root?.unmount();
	}
}
