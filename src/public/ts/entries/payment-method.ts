import { Budget } from "../budget"
import { Buttons, create, goToElement, resetForm, Tooltips } from "../utils"
import { Entry } from "./entry"

export class PaymentMethod extends Entry {
   static Constraints = {
      Name: {
         MinLength: 3,
         MaxLength: 25
      }
   }

   name: string
   owner_uuid: string

   get owner() {
      return this.budget.getPerson(this.owner_uuid)
   }

   constructor(budget: Budget, data: { uuid: string, name: string, owner_uuid: string }) {
      super(budget, data.uuid)
      this.name = data.name
      this.owner_uuid = data.owner_uuid
   }

   build() {
      this.row.innerHTML = ''
      // Name
      this.row.insertCell().textContent = this.name
      // owner UUID
      this.row.insertCell().appendChild(create('a', { href: '#' }, this.owner?.name))
         .addEventListener('click', (e) => goToElement(this.owner?.row))
      // Actions
      const actions = this.row.insertCell().appendChild(create('span', { class: 'd-flex gap-1' }))
      actions.appendChild(Buttons.Edit()).addEventListener('click', () => this.edit())
      actions.appendChild(Buttons.Delete()).addEventListener('click', () => this.delete())
      return this.row
   }

   edit() {
      PaymentMethod.buildForm(this.row, this.budget, this)
   }

   save() {
      if (PaymentMethod.validateForm(this.row)) {
         const [nameInput, ownerSelect] = PaymentMethod.getFields(this.row)
         this.name = nameInput.value
         this.owner_uuid = ownerSelect.value
         this.budget.onPaymentMethodsChanged()
      }
   }

   delete() {
      if (confirm('Are you sure you want to delete this entry?')) {
         this.budget.people = this.budget.people.filter(person => person.uuid !== this.uuid)
         document.getElementById(this.uuid)?.remove()
      }
   }

   static buildForm(row: HTMLTableRowElement, budget: Budget, editTarget?: PaymentMethod) {
      row.innerHTML = ''
      // Name
      const nameInput = row.appendChild(create('td')).appendChild(create('input', {
         class: 'form-control',
         type: 'text',
         placeholder: 'Name'
      }))
      nameInput.addEventListener('input', this.validateForm.bind(this, row))
      Tooltips.create(nameInput, 'bottom', `${this.Constraints.Name.MinLength} to ${this.Constraints.Name.MaxLength} characters`)
      // Owner
      const ownerSelect = row.appendChild(create('td')).appendChild(create('select', { class: 'form-control' }))
      this.generateSelectOptions(budget, ownerSelect)
      ownerSelect.addEventListener('focusin', (e) => this.generateSelectOptions(budget, ownerSelect))
      ownerSelect.addEventListener('change', this.validateForm.bind(this, row))
      // Actions
      const actions = row.insertCell().appendChild(create('span', { class: 'd-flex gap-1' }))
      if (editTarget) {
         actions.appendChild(Buttons.Save()).addEventListener('click', () => editTarget.save())
         actions.appendChild(Buttons.Cancel()).addEventListener('click', () => editTarget.build())
      } else {
         actions.appendChild(Buttons.Add()).addEventListener('click', (e) => {
            // Trim values
            nameInput.value = nameInput.value.trim()
            if (this.validateForm(row)) {
               budget.paymentMethods.push(new this(budget, {
                  uuid: crypto.randomUUID(),
                  name: nameInput.value,
                  owner_uuid: ownerSelect.value
               }))
               budget.onPaymentMethodsChanged()
               resetForm(row)
            }
         })
      }
      // Data
      if (editTarget) {
         nameInput.value = editTarget.name
         ownerSelect.value = editTarget.owner_uuid
      }
      return row
   }

   static getFields(form: HTMLTableRowElement) {
      return [
         form.cells[0].getElementsByTagName('input')[0], // nameInput
         form.cells[1].getElementsByTagName('select')[0] // ownerSelect
      ]
   }

   static validateForm(form: HTMLTableRowElement) {
      const [nameInput, ownerSelect] = this.getFields(form)
      const results: [HTMLElement, boolean][] = []
      results.push([nameInput, nameInput.value.trim().length >= PaymentMethod.Constraints.Name.MinLength && nameInput.value.trim().length <= PaymentMethod.Constraints.Name.MaxLength])
      results.push([ownerSelect, ownerSelect.value !== ''])
      for (const [element, valid] of results) {
         element.classList.toggle('is-invalid', !valid)
         element.classList.toggle('is-valid', valid)
      }
      return results.every(result => result[1])
   }

   static generateSelectOptions(budget: Budget, select: HTMLSelectElement) {
      select.innerHTML = ''
      select.options.add(create('option', { value: '', selected: '', disabled: '', hidden: '' }, 'Select Owner...'))
      for (const person of budget.people)
         select.options.add(create('option', { value: person.uuid }, person.name))
   }
}
