import { budget } from ".."
import { Budget } from "../budget"
import { Buttons, create, resetForm, Tooltips } from "../utils"
import { Entry } from "./entry"

export class Person extends Entry {
   static Constraints = {
      Name: {
         MinLength: 3,
         MaxLength: 15
      }
   }

   name: string

   constructor(budget: Budget, data: { uuid: string, name: string }) {
      super(budget, data.uuid)
      this.name = data.name
   }

   build() {
      this.row.innerHTML = ''
      // Name
      this.row.insertCell().textContent = this.name
      // Actions
      const actions = this.row.insertCell().appendChild(create('span', { class: 'd-flex gap-1' }))
      actions.appendChild(Buttons.Edit()).addEventListener('click', () => this.edit())
      actions.appendChild(Buttons.Delete()).addEventListener('click', () => this.delete())
      return this.row
   }

   edit() {
      Person.buildForm(this.row, this.budget, this)
   }

   save() {
      if (Person.validateForm(this.row)) {
         const [nameInput] = Person.getFields(this.row)
         this.name = nameInput.value
         budget.onPeopleChanged()
      }
   }

   delete() {
      if (confirm('Are you sure you want to delete this entry?')) {
         budget.people = budget.people.filter(person => person.uuid !== this.uuid)
         budget.onPeopleChanged()
      }
   }

   static buildForm(row: HTMLTableRowElement, budget: Budget, editTarget?: Person) {
      row.innerHTML = ''
      // Name
      const nameInput = row.appendChild(create('td')).appendChild(create('input', {
         class: 'form-control',
         type: 'text',
         placeholder: 'Name'
      }))
      nameInput.addEventListener('input', this.validateForm.bind(this, row))
      Tooltips.create(nameInput, 'bottom', `${this.Constraints.Name.MinLength} to ${this.Constraints.Name.MaxLength} characters`)
      // Actions
      const actions = row.insertCell().appendChild(create('span', { class: 'd-flex gap-1' }))
      if (editTarget) {
         actions.appendChild(Buttons.Save()).addEventListener('click', () => editTarget.save())
         actions.appendChild(Buttons.Cancel()).addEventListener('click', () => editTarget.build())
      } else {
         actions.appendChild(Buttons.Add()).addEventListener('click', (e) => {
            nameInput.value = nameInput.value.trim()
            if (this.validateForm(row)) {
               budget.people.push(new this(budget, { uuid: crypto.randomUUID(), name: nameInput.value }))
               budget.onPeopleChanged()
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
}
