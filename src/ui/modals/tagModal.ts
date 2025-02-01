import { Setting, Notice } from 'obsidian';
import { EditModal, isEmpty } from './modal';
import { isString } from 'util';

export async function tagModal(this: EditModal) {
	const tags = await this.database.listTags();

	interface Tag {
		id: number | null;
		title: string | null;
	}

	const tag: Tag = {
		id: null,
		title: null,
	}

	new Setting(this.contentEl)
		.setName("Manage Tags")
		.addDropdown((d) => {
			tags.forEach((item: any, idx: number) => {
				d.addOption(idx.toString(), item.title)
			})
			d
				.setValue('')
				.onChange((value: any) => {
					const component: any = title.components[0]
					component.setValue(tags[value].title)
					tag.id = tags[value].id; 
					tag.title = tags[value].title; 
				})
		})
		.addButton((button) => {
			button
				.setButtonText("Delete")
				.onClick(async() => {
					if (!tag.id)
						return

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
					const title = isEmpty(value)
					if (!isString(title)) {
						new Notice("Can't be empty")
						tag.title = null; 
						return
					}
					tag.title = title; 
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

				if (tag.id) {
					res = await this.database.updateTag(tag)
					if (res.error) {
						this.validate(res.detail, fields)
						return
					}
					this.data = { update: res }
				} else {
					res = await this.database.createTag(tag)
					if (res.error) {
						this.validate(res.detail, fields)
						return
					}
					this.data = res
				}
				this.close();
			}));
}
