import { Setting, Notice } from 'obsidian';
import { EditModal, isEmpty } from './modal';
import { isString } from 'util';
import { Category } from 'types';

export async function categoryModal(this: EditModal) {
	const categories = await this.database.listCategories();

	const category: Category = {
		id: null,
		title: null,
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
				.onChange((v: string) => {
					const value: number = Number(v);
					(title.components[0] as any).setValue(categories[value].title)
					(parent.components[0] as any).setValue(categories[value].parent_id)
					category.id = categories[value].id; 
					category.parent_id = categories[value].parent_id; 
					category.title = categories[value].title; 
				})
		})
		.addButton((button) => {
			button
				.setButtonText("Delete")
				.onClick(async() => {
					this.data = {
						delete: await this.database.deleteCategory(category.id as number)
					}
					this.close()
				})
		})
	const title = new Setting(this.contentEl)
		.setName("Title")
		.addText((text) => {
			text
				.onChange((value) => {
					const title = isEmpty(value)
					if (!isString(title)) {
						new Notice("Can't be empty")
						category.title = null; 
						return
					}
					category.title = title; 
				})
		})

	const parent = new Setting(this.contentEl)
		.setName("Parent Category")
		.addDropdown((d) => {
			d.addOption("null", "--Without parent--")
			categories.forEach((item: any) => {
				d.addOption(item.id.toString(), item.title)
			})
			d
			.setValue('')
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
				let res
				const fields = {
					title: (title.components[0] as any)?.inputEl,
				}
				if (category.id) {
					res = await this.database.updateCategory(category)
					if ('error' in res) {
						this.validate(res.detail, fields)
						return
					}
					this.data = { update: res }
				}
				else {
					res = await this.database.createCategory(category)
					if ('error' in res) {
						this.validate(res.detail, fields)
						return
					}
					this.data = res
				}

				this.close();
			}));
}
