import { budget } from ".."
import { Budget } from "../budget"
import { Buttons, create, createInputGroup, Icons, resetForm, Tooltips } from "../utils"
import { Entry, EntryJson } from "./entry"

interface CategoryJson extends EntryJson {
   icon: string
   name: string
}

export class Category extends Entry {
   static Constraints = {
      Name: {
         MinLength: 3,
         MaxLength: 12
      }
   }

   icon: string
   name: string

   constructor(budget: Budget, data: CategoryJson) {
      super(budget, data)
      this.icon = data.icon
      this.name = data.name
   }

   build() {
      this.row.innerHTML = ''
      // Icon
      this.row.insertCell().appendChild(
         create('div', { class: 'input-group' }, [
            create('span', { class: 'input-group-text' }, [
               create('i', { class: this.icon })
            ])
         ])
      )
      // Name
      this.row.insertCell().textContent = this.name
      // Actions
      const actions = this.row.insertCell().appendChild(create('span', { class: 'd-flex gap-2' }))
      actions.appendChild(Buttons.Edit).addEventListener('click', () => this.edit())
      actions.appendChild(Buttons.Delete).addEventListener('click', () => this.delete())
      return this.row
   }

   edit() {
      Category.buildForm(this.row, this.budget, this)
   }

   save() {
      if (Category.validateForm(this.row)) {
         const [categorySelect, nameInput] = Category.getFields(this.row)
         this.icon = categorySelect.value
         this.name = nameInput.value
         budget.refreshAll()
      }
   }

   delete() {
      if (confirm('Are you sure you want to delete this entry?')) {
         budget.categories.delete(this.uuid)
         budget.refreshAll()
      }
   }

   toJson(): CategoryJson {
      return {
         uuid: this.uuid,
         icon: this.icon,
         name: this.name
      }
   }

   static buildForm(row: HTMLTableRowElement, budget: Budget, editTarget?: Category) {
      row.innerHTML = ''
      // Icon
      const iconSelect = row.insertCell()
         .appendChild(createInputGroup(Icons.Bookmarks))
         .appendChild(create('select', { class: 'form-select' }))
      iconSelect.options.add(create('option', { value: '', selected: '', disabled: '', hidden: '' }, 'Select...'))
      for (const [name, icon] of Object.entries(Icons))
         iconSelect.options.add(create('option', { value: icon.classList[1] }, name))
      // Name
      const nameInput = row.insertCell()
         .appendChild(createInputGroup(Icons.Nametag))
         .appendChild(create('input', {
            class: 'form-control',
            type: 'text',
            placeholder: 'Name'
         }))
      nameInput.addEventListener('input', this.validateForm.bind(this, row))
      Tooltips.create(nameInput, 'bottom', `${this.Constraints.Name.MinLength} to ${this.Constraints.Name.MaxLength} characters`)
      // Actions
      const actions = row.insertCell().appendChild(create('span', { class: 'd-flex gap-2' }))
      if (editTarget) {
         actions.appendChild(Buttons.Save).addEventListener('click', () => editTarget.save())
         actions.appendChild(Buttons.Cancel).addEventListener('click', () => editTarget.build())
      } else {
         actions.appendChild(Buttons.Add).addEventListener('click', (e) => {
            nameInput.value = nameInput.value.trim()
            if (this.validateForm(row)) {
               const uuid = crypto.randomUUID()
               budget.categories.set(uuid, new this(budget, {
                  uuid: uuid,
                  icon: iconSelect.value,
                  name: nameInput.value
               }))
               budget.refreshAll()
               resetForm(row)
            }
         })
      }
      // Data
      if (editTarget) {
         nameInput.value = editTarget.name
      }
      return row
   }

   static getFields(form: HTMLTableRowElement) {
      return [
         form.cells[0].getElementsByTagName('select')[0], // iconSelect
         form.cells[1].getElementsByTagName('input')[0] // nameInput
      ]
   }

   static validateForm(form: HTMLTableRowElement) {
      const [iconSelect, nameInput] = this.getFields(form)
      const results: [HTMLElement, boolean][] = []
      results.push([nameInput, nameInput.value.trim().length >= Category.Constraints.Name.MinLength && nameInput.value.trim().length <= Category.Constraints.Name.MaxLength])
      results.push([iconSelect, iconSelect.value !== ''])
      for (const [element, valid] of results) {
         element.classList.toggle('is-invalid', !valid)
         element.classList.toggle('is-valid', valid)
      }
      return results.every(result => result[1])
   }

   static generateSelectOptions(budget: Budget, select: HTMLSelectElement) {
      select.innerHTML = ''
      select.options.add(create('option', { value: '', selected: '', disabled: '', hidden: '' }, 'Select...'))
      console.log(budget.categories)
      for (const category of budget.categories.values())
         select.options.add(create('option', { value: category.uuid }, category.name))
   }
}
