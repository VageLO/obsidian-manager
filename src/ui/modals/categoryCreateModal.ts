import { Setting, Notice } from 'obsidian';
import { EditModal } from './modal';

export async function createCategory(this: EditModal) {
	const categories = await this.database.listCategories();

	interface Category {
		title: string;
		parent_id: number;
	}
	const category: Account = {
		title: '',
		parent_id: null,
	}

	new Setting(this.contentEl)
		.setName("Title")
		.addText((text) => {
			text
				.onChange((value) => {
					category.title = value.trim(); 
				})
		})

	new Setting(this.contentEl)
		.setName("Parent Category")
		.addDropdown((d) => {
			categories.forEach((item, idx) => {
				d.addOption(item.id, item.title)
				if (idx == 0) {
					d.setValue(item.id)
					category.parent_id = item.id
				}
			})

			d
				.onChange((value) => {
					value = +value
					category.parent_id = value;
				})
		})

	new Setting(this.contentEl)
		.addButton((btn) =>
			btn
			.setButtonText('💾')
			.setCta()
			.onClick(() => {
				this.close();
				console.log(category)
			}));
}
