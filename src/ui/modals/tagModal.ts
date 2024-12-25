import { Setting } from 'obsidian';
import { ManagerAPIDatabase } from '../../api';
import { EditModal } from './modal';

export async function tagModal(this: EditModal) {
	const tags = await this.database.listTags();

	interface Tag {
		id: number | null;
		title: string;
	}

	const tag: Tag = {
		id: null,
		title: '',
	}

	new Setting(this.contentEl)
		.setName("Manage Tags")
		.addDropdown((d) => {
			tags.forEach((item: any, idx: number) => {
				d.addOption(idx.toString(), item.title)
			})
			d
				.setValue('')
				.onChange((value) => {
					title.components[0].setValue(tags[value].title)
					tag.id = tags[value].id; 
					tag.title = tags[value].title; 
				})
		})
		.addButton((button) => {
			button
				.setButtonText("Delete")
				.onClick(async() => {
					this.data = {
						delete: await this.database.deleteTag(tag.id)
					}
					this.close()
				})
		})
	const title = new Setting(this.contentEl)
		.setName("Title")
		.addText((text) => {
			text
				.onChange((value) => {
					tag.title = value.trim(); 
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
					title: title.components[0].inputEl,
				}

				if (tag.id) {
					res = await this.database.updateTag(tag)
					if (res.error && this.database instanceof ManagerAPIDatabase) {
						this.database.validate(res.detail, fields)
						return
					}
					this.data = { update: res }
				} else {
					res = await this.database.createTag(tag)
					if (res.error && this.database instanceof ManagerAPIDatabase) {
						this.database.validate(res.detail, fields)
						return
					}
					this.data = await this.database.createTag(tag)
				}
				this.close();
			}));
}
