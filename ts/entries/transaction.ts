import { Budget } from "../budget"
import { Buttons, create, createInputGroup, goToElement, Icons, resetForm, Tooltips } from "../utils"
import { Category } from "./category"
import { CYCLE, CYCLE_DAYS, isCycle } from "./cycle"
import { Entry, EntryJson } from "./entry"
import { PaymentMethod } from "./payment-method"

export interface TransactionJson extends EntryJson {
   category_uuid: string
   name: string
   amount: number
   payment_method_uuid: string,
   billing_cycle: [number, CYCLE]
}

export class Transaction extends Entry {
   static Constraints = {
      Name: {
         MinLength: 3,
         MaxLength: 25
      },
      BillingCycle: {
         Min: 1
      }
   }

   category_uuid: string
   name: string
   #amount: number
   payment_method_uuid: string
   billing_cycle: TransactionJson['billing_cycle']

   get amount() { return this.#amount }
   set amount(value) { this.#amount = Math.round(value * 100) / 100 }

   get category() { return this.budget.categories.get(this.category_uuid) }
   get paymentMethod() { return this.budget.paymentMethods.get(this.payment_method_uuid) }

   constructor(budget: Budget, data: TransactionJson) {
      super(budget, data)
      this.category_uuid = data.category_uuid
      this.name = data.name
      this.amount = data.amount
      this.payment_method_uuid = data.payment_method_uuid
      this.billing_cycle = data.billing_cycle
   }

   amountPer(targetDays: number) {
      const originalDays = CYCLE_DAYS[this.billing_cycle[1]] * this.billing_cycle[0]
      return this.amount * targetDays / originalDays
   }

   createLink(): HTMLAnchorElement {
      return create('a', { class: 'text-primary' }, [Icons.Bidirectional, ' ' + this.name])
   }

   build() {
      this.row.innerHTML = ''
      // Name and Category
      this.row.insertCell().appendChild(this.category?.createLink() ?? Entry.unknownLink())
         .addEventListener('click', (e) => goToElement(this.category?.row))
      this.row.insertCell().textContent = this.name
      // Amount
      const isPositive = this.amount >= 0
      const sign = isPositive ? '+' : '-'
      const amount = Math.abs(this.amount)
      this.row.insertCell().append(create(
         'span',
         { class: 'monospace ' + (isPositive ? 'text-success' : 'text-danger') },
         `${sign}$${amount.toFixed(2)}`
      ))
      // Payment Method
      this.row.insertCell().appendChild(this.paymentMethod?.createLink() ?? Entry.unknownLink())
         .addEventListener('click', (e) => goToElement(this.paymentMethod?.row))
      // Billing Cycle
      this.row.insertCell().textContent = `${this.billing_cycle[0]} ${this.billing_cycle[1] + (this.billing_cycle[0] > 1 ? 's' : '')}`
      // Actions
      const actions = this.row.insertCell().appendChild(create('span', { class: 'd-flex gap-2' }))
      actions.appendChild(Buttons.Edit).addEventListener('click', () => this.edit())
      actions.appendChild(Buttons.Delete).addEventListener('click', () => this.delete())
      return this.row
   }

   edit() {
      Transaction.buildForm(this.row, this.budget, this)
   }

   save() {
      if (Transaction.validateForm(this.row)) {
         const [categorySelect, nameInput, amountInput, paymentMethodSelect] = Transaction.getFields(this.row)
         this.category_uuid = categorySelect.value
         this.name = nameInput.value
         this.amount = parseFloat(amountInput.value)
         this.payment_method_uuid = paymentMethodSelect.value
         this.budget.refreshAll()
      }
   }

   delete() {
      if (confirm('Are you sure you want to delete this entry?')) {
         this.budget.transactions.delete(this.uuid)
         this.budget.refreshAll()
      }
   }

   toJson(): TransactionJson {
      return {
         uuid: this.uuid,
         category_uuid: this.category_uuid,
         name: this.name,
         amount: this.amount,
         payment_method_uuid: this.payment_method_uuid,
         billing_cycle: this.billing_cycle
      }
   }

   static buildForm(row: HTMLTableRowElement, budget: Budget, targetListOrEntry?: Map<string, Transaction> | Transaction) {
      row.innerHTML = ''
      // Category
      const categorySelect = row.insertCell()
         .appendChild(create('select', { class: 'form-select' }))
      Category.generateSelectOptions(budget, categorySelect)
      categorySelect.addEventListener('focusin', (e) => Category.generateSelectOptions(budget, categorySelect))
      categorySelect.addEventListener('change', this.validateForm.bind(this, row))
      // Name
      const nameInput = row.insertCell()
         .appendChild(create('input', {
            class: 'form-control',
            type: 'text',
            placeholder: 'Name'
         }))
      nameInput.addEventListener('input', this.validateForm.bind(this, row))
      Tooltips.create(nameInput, 'bottom', `${this.Constraints.Name.MinLength} to ${this.Constraints.Name.MaxLength} characters`)
      // Amount
      const amountInput = row.insertCell()
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
         .appendChild(create('select', { class: 'form-select' }))
      PaymentMethod.generateSelectOptions(budget, paymentMethodSelect)
      paymentMethodSelect.addEventListener('focusin', (e) => PaymentMethod.generateSelectOptions(budget, paymentMethodSelect))
      paymentMethodSelect.addEventListener('change', this.validateForm.bind(this, row))
      // Billing Cycle
      const group = row.insertCell().appendChild(create('div', { class: 'input-group' }))
      const cycleInput = group
         .appendChild(create('input', {
            class: 'form-control',
            type: 'number',
            placeholder: 'Count',
            step: '1',
            min: '1'
         }))
      cycleInput.addEventListener('input', this.validateForm.bind(this, row))
      Tooltips.create(cycleInput, 'bottom', 'Number of days, weeks, months, or years. Must be greater than 0.')
      const cycleSelect = group.appendChild(create('select', { class: 'form-select' }))
      cycleSelect.options.add(new Option('Cycle', '', true, true))
      cycleSelect.options.add(new Option('Day', CYCLE.DAY))
      cycleSelect.options.add(new Option('Week', CYCLE.WEEK))
      cycleSelect.options.add(new Option('Month', CYCLE.MONTH))
      cycleSelect.options.add(new Option('Year', CYCLE.YEAR))
      cycleSelect.options[0].disabled = true
      cycleSelect.options[0].hidden = true
      cycleSelect.addEventListener('change', this.validateForm.bind(this, row))
      // Actions
      const actions = row.insertCell().appendChild(create('span', { class: 'd-flex gap-2' }))
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
                  category_uuid: categorySelect.value,
                  name: nameInput.value,
                  amount: parseFloat(amountInput.value),
                  payment_method_uuid: paymentMethodSelect.value,
                  billing_cycle: [parseInt(cycleInput.value), cycleSelect.value as CYCLE]
               }))
               budget.refreshAll()
               resetForm(row)
            }
         })
      }
      // Data
      if (targetListOrEntry instanceof Transaction) {
         categorySelect.value = targetListOrEntry.category_uuid
         nameInput.value = targetListOrEntry.name
         amountInput.value = targetListOrEntry.amount.toString()
         paymentMethodSelect.value = targetListOrEntry.payment_method_uuid
         cycleInput.value = targetListOrEntry.billing_cycle[0].toString()
         cycleSelect.value = targetListOrEntry.billing_cycle[1]
      }
      return row
   }

   static getFields(form: HTMLTableRowElement) {
      return [
         form.cells[0].getElementsByTagName('select')[0], // categorySelect
         form.cells[1].getElementsByTagName('input')[0], // nameInput
         form.cells[2].getElementsByTagName('input')[0], // amountInput
         form.cells[3].getElementsByTagName('select')[0], // paymentMethodSelect
         form.cells[4].getElementsByTagName('input')[0], // cycleInput
         form.cells[4].getElementsByTagName('select')[0] // cycleSelect
      ]
   }

   static validateForm(form: HTMLTableRowElement) {
      const [categorySelect, nameInput, amountInput, paymentMethodSelect, cycleInput, cycleSelect] = this.getFields(form)
      const results: [HTMLElement, boolean][] = []
      results.push([categorySelect, categorySelect.value !== ''])
      results.push([nameInput, nameInput.value.trim().length >= Transaction.Constraints.Name.MinLength && nameInput.value.trim().length <= Transaction.Constraints.Name.MaxLength])
      results.push([amountInput, !isNaN(+amountInput.value) && +amountInput.value !== 0])
      results.push([paymentMethodSelect, paymentMethodSelect.value !== ''])
      results.push([cycleInput, +cycleInput.value >= Transaction.Constraints.BillingCycle.Min])
      results.push([cycleSelect, cycleSelect.value !== ''])
      for (const [element, valid] of results) {
         element.classList.toggle('is-invalid', !valid)
         element.classList.toggle('is-valid', valid)
      }
      return results.every(result => result[1])
   }

   static generateSelectOptions(budget: Budget, select: HTMLSelectElement) {
      select.innerHTML = ''
      select.options.add(create('option', { value: '', selected: '', disabled: '', hidden: '' }, 'Transaction'))
      for (const transaction of budget.transactions.values())
         select.options.add(create('option', { value: transaction.uuid }, transaction.name))
   }
}
