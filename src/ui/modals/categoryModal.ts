import { Setting } from 'obsidian';
import { EditModal } from './modal';

export async function categoryModal(this: EditModal) {
	const categories = await this.database.listCategories();

	interface Category {
		id: number | null;
		title: string;
		parent_id: number | null;
	}

	const category: Category = {
		id: null,
		title: '',
		parent_id: null,
	}

	new Setting(this.contentEl)
		.setName("Manage Categories")
		.addDropdown((d) => {
			categories.forEach((item: any, idx: number) => {
				d.addOption(idx.toString(), item.title)
			})
			d
				.setValue('')
				.onChange((value) => {
					title.components[0].setValue(categories[value].title)
					parent.components[0].setValue(categories[value].parent_id)
					category.id = categories[value].id; 
					category.parent_id= categories[value].parent_id; 
					category.title = categories[value].title; 
				})
		})
		.addButton((button) => {
			button
				.setButtonText("Delete")
				.onClick(async() => {
					this.data = {
						delete: await this.database.deleteCategory(category.id)
					}
					this.close()
				})
		})
	const title = new Setting(this.contentEl)
		.setName("Title")
		.addText((text) => {
			text
				.onChange((value) => {
					category.title = value.trim(); 
				})
		})

	const parent = new Setting(this.contentEl)
		.setName("Parent Category")
		.addDropdown((d) => {
			categories.forEach((item: any) => {
				d
					.addOption(item.id.toString(), item.title)
					.setValue('')
			})

			d
				.onChange((value) => {
					category.parent_id = +value;
				})
		})

	new Setting(this.contentEl)
		.addButton((btn) =>
			btn
			.setButtonText('💾')
			.setCta()
			.onClick(async() => {
				if (category.id)
					this.data = { update: await this.database.updateCategory(category) }
				else
					this.data = await this.database.createCategory(category)

				this.close();
			}));
}
