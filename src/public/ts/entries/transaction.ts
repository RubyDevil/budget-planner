import { Budget } from "../budget"
import { Buttons, create, createInputGroup, goToElement, Icons, resetForm, Tooltips } from "../utils"
import { Entry, EntryJson } from "./entry"
import { PaymentMethod } from "./payment-method"

export interface TransactionJson extends EntryJson {
   name: string
   amount: number
   payment_method_uuid: string
}

export class Transaction extends Entry {
   static Constraints = {
      Name: {
         MinLength: 3,
         MaxLength: 25
      }
   }

   name: string
   #amount: number
   get amount() { return this.#amount }
   set amount(value) { this.#amount = Math.round(value * 100) / 100 }
   payment_method_uuid: string

   get paymentMethod() {
      return this.budget.paymentMethods.get(this.payment_method_uuid)
   }

   constructor(budget: Budget, data: TransactionJson) {
      super(budget, data)
      this.name = data.name
      this.amount = data.amount
      this.payment_method_uuid = data.payment_method_uuid
   }

   build() {
      this.row.innerHTML = ''
      // Name
      this.row.insertCell().textContent = this.name
      // Amount
      const isPositive = this.amount >= 0
      const sign = isPositive ? '+' : '-'
      const amount = Math.abs(this.amount)
      this.row.insertCell().append(create(
         'span',
         { class: 'monospace ' + (isPositive ? 'positive' : 'negative') },
         `${sign}$${amount.toFixed(2)}`
      ))
      // Payment Method
      this.row.insertCell().appendChild(create('a', { href: '#' }, this.paymentMethod?.name))
         .addEventListener('click', (e) => goToElement(this.paymentMethod?.row))
      // Actions
      const actions = this.row.insertCell().appendChild(create('span', { class: 'd-flex gap-1' }))
      actions.appendChild(Buttons.Edit).addEventListener('click', () => this.edit())
      actions.appendChild(Buttons.Delete).addEventListener('click', () => this.delete())
      return this.row
   }

   edit() {
      Transaction.buildForm(this.row, this.budget, this)
   }

   save() {
      if (Transaction.validateForm(this.row)) {
         const [nameInput, amountInput, paymentMethodSelect] = Transaction.getFields(this.row)
         this.name = nameInput.value
         this.amount = parseFloat(amountInput.value)
         this.payment_method_uuid = paymentMethodSelect.value
         this.budget.refreshAll()
      }
   }

   delete() {
      if (confirm('Are you sure you want to delete this entry?')) {
         this.budget.bills.delete(this.uuid)
         this.budget.refreshAll()
      }
   }

   toJson(): TransactionJson {
      return {
         uuid: this.uuid,
         name: this.name,
         amount: this.amount,
         payment_method_uuid: this.payment_method_uuid
      }
   }

   static buildForm(row: HTMLTableRowElement, budget: Budget, targetListOrEntry?: Map<string, Transaction> | Transaction) {
      row.innerHTML = ''
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
      // Amount
      const amountInput = row.insertCell()
         .appendChild(createInputGroup(Icons.Dollar))
         .appendChild(create('input', {
            class: 'form-control',
            type: 'number',
            placeholder: 'Amount',
            step: '0.01'
         }))
      amountInput.addEventListener('input', this.validateForm.bind(this, row))
      Tooltips.create(amountInput, 'bottom', 'Non-zero amount, negative for expenses and positive for income')
      // Payment Method
      const paymentMethodSelect = row.insertCell()
         .appendChild(createInputGroup(Icons.Card))
         .appendChild(create('select', { class: 'form-control' }))
      PaymentMethod.generateSelectOptions(budget, paymentMethodSelect)
      paymentMethodSelect.addEventListener('focusin', (e) => PaymentMethod.generateSelectOptions(budget, paymentMethodSelect))
      paymentMethodSelect.addEventListener('change', this.validateForm.bind(this, row))
      // Actions
      const actions = row.insertCell().appendChild(create('span', { class: 'd-flex gap-1' }))
      if (targetListOrEntry instanceof Transaction) {
         actions.appendChild(Buttons.Save).addEventListener('click', () => targetListOrEntry.save())
         actions.appendChild(Buttons.Cancel).addEventListener('click', () => targetListOrEntry.build())
      } else if (targetListOrEntry instanceof Map) {
         actions.appendChild(Buttons.Add).addEventListener('click', (e) => {
            // Trim values
            nameInput.value = nameInput.value.trim()
            if (this.validateForm(row)) {
               const uuid = crypto.randomUUID()
               targetListOrEntry.set(uuid, new this(budget, {
                  uuid: uuid,
                  name: nameInput.value,
                  amount: parseFloat(amountInput.value),
                  payment_method_uuid: paymentMethodSelect.value
               }))
               budget.refreshAll()
               resetForm(row)
            }
         })
      }
      // Data
      if (targetListOrEntry instanceof Transaction) {
         nameInput.value = targetListOrEntry.name
         amountInput.value = targetListOrEntry.amount.toString()
         paymentMethodSelect.value = targetListOrEntry.payment_method_uuid
      }
      return row
   }

   static getFields(form: HTMLTableRowElement) {
      return [
         form.cells[0].getElementsByTagName('input')[0], // nameInput
         form.cells[1].getElementsByTagName('input')[0], // amountInput
         form.cells[2].getElementsByTagName('select')[0] // paymentMethodSelect
      ]
   }

   static validateForm(form: HTMLTableRowElement) {
      const [nameInput, amountInput, paymentMethodSelect] = this.getFields(form)
      const results: [HTMLElement, boolean][] = []
      results.push([nameInput, nameInput.value.trim().length >= Transaction.Constraints.Name.MinLength && nameInput.value.trim().length <= Transaction.Constraints.Name.MaxLength])
      results.push([amountInput, !isNaN(+amountInput.value) && +amountInput.value !== 0])
      results.push([paymentMethodSelect, paymentMethodSelect.value !== ''])
      for (const [element, valid] of results) {
         element.classList.toggle('is-invalid', !valid)
         element.classList.toggle('is-valid', valid)
      }
      return results.every(result => result[1])
   }

   static generateSelectOptions(budget: Budget, select: HTMLSelectElement) {
      select.innerHTML = ''
      select.options.add(create('option', { value: '', selected: '', disabled: '', hidden: '' }, 'Select...'))
      for (const transaction of budget.bills.values())
         select.options.add(create('option', { value: transaction.uuid }, transaction.name))
   }
}
