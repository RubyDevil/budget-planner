import { budget } from ".."
import { Budget } from "../budget"
import { Buttons, create, createInputGroup, Icons, resetForm, Tooltips } from "../utils"
import { Entry, EntryJson } from "./entry"

interface PersonJson extends EntryJson {
   name: string
}

export class Person extends Entry {
   static Constraints = {
      Name: {
         MinLength: 3,
         MaxLength: 15
      }
   }

   name: string

   constructor(budget: Budget, data: PersonJson) {
      super(budget, data)
      this.name = data.name
   }

   createLink(): HTMLAnchorElement {
      return create('a', { class: 'text-primary' }, [Icons.Person, ' ' + this.name])
   }

   build() {
      this.row.innerHTML = ''
      // Name
      this.row.insertCell().textContent = this.name
      // Actions
      const actions = this.row.insertCell().appendChild(create('span', { class: 'd-flex gap-2' }))
      actions.appendChild(Buttons.Edit).addEventListener('click', () => this.edit())
      actions.appendChild(Buttons.Delete).addEventListener('click', () => this.delete())
      return this.row
   }

   edit() {
      Person.buildForm(this.row, this.budget, this)
   }

   save() {
      if (Person.validateForm(this.row)) {
         const [nameInput] = Person.getFields(this.row)
         this.name = nameInput.value
         budget.refreshAll()
      }
   }

   delete() {
      if (confirm('Are you sure you want to delete this entry?')) {
         budget.people.delete(this.uuid)
         budget.refreshAll()
      }
   }

   toJson(): PersonJson {
      return {
         uuid: this.uuid,
         name: this.name
      }
   }

   static buildForm(row: HTMLTableRowElement, budget: Budget, editTarget?: Person) {
      row.innerHTML = ''
      // Name
      const nameInput = row.insertCell()
         // .appendChild(createInputGroup(Icons.Nametag))
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
               budget.people.set(uuid, new this(budget, { uuid: uuid, name: nameInput.value }))
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
         form.cells[0].getElementsByTagName('input')[0] // nameInput
      ]
   }

   static validateForm(form: HTMLTableRowElement) {
      const [nameInput] = this.getFields(form)
      const results: [HTMLElement, boolean][] = []
      results.push([nameInput, nameInput.value.trim().length >= Person.Constraints.Name.MinLength && nameInput.value.trim().length <= Person.Constraints.Name.MaxLength])
      for (const [element, valid] of results) {
         element.classList.toggle('is-invalid', !valid)
         element.classList.toggle('is-valid', valid)
      }
      return results.every(result => result[1])
   }

   static generateSelectOptions(budget: Budget, select: HTMLSelectElement) {
      select.innerHTML = ''
      select.options.add(create('option', { value: '', selected: '', disabled: '', hidden: '' }, 'Person'))
      for (const person of budget.people.values())
         select.options.add(create('option', { value: person.uuid }, person.name))
   }
}
