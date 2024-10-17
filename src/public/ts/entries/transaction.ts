import { Budget } from "../budget"
import { Modal } from "../modal"
import { Buttons, create, createInputGroup, goToElement, Icons, resetForm, Tooltips, withFloatingLabel } from "../utils"
import { Category } from "./category"
import { CYCLE, CYCLE_DAYS } from "./cycle"
import { Entry, EntryJson } from "./entry"
import { PaymentMethod } from "./payment-method"
import { Person } from "./person"

export interface TransactionJson extends EntryJson {
   category_uuid: string
   name: string
   amount: number
   payment_method_uuid: string
   billing_cycle: [number, CYCLE]
   payers: { [uuid: string]: number }
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
   billing_cycle: [number, CYCLE]
   payers: Map<string, number>

   get amount() { return this.#amount }
   set amount(value) { this.#amount = Math.round(value * 100) / 100 }

   get category() { return this.budget.categories.get(this.category_uuid) }
   get paymentMethod() { return this.budget.paymentMethods.get(this.payment_method_uuid) }

   constructor(budget: Budget, data: TransactionJson) {
      super(budget, data)
      this.category_uuid = data.category_uuid ?? ''
      this.name = data.name ?? ''
      this.amount = data.amount ?? 0
      this.payment_method_uuid = data.payment_method_uuid ?? ''
      this.billing_cycle = data.billing_cycle ?? [0, '']
      this.payers = new Map(Object.entries(data.payers ?? {}))
   }

   amountFor(targetDays: number, targetPerson?: Person) {
      const originalDays = CYCLE_DAYS[this.billing_cycle[1]] * this.billing_cycle[0]
      const total = this.amount * targetDays / originalDays
      const percentage = targetPerson ? this.payers.get(targetPerson.uuid) ?? 0 : 1
      return Math.ceil(total * percentage * 100) / 100
   }

   createLink(): HTMLAnchorElement {
      return create('a', { class: 'text-primary' }, [Icons.Bidirectional, ' ' + this.name])
   }

   buildRow() {
      this.row.style.backgroundColor = this.category?.accentColor() ?? '#ffffff'
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
      this.row.querySelectorAll('td')?.forEach(td => td.style.background = 'inherit')
      // Ergonomy and Responsiveness
      this.row.cells[0].classList.add('d-none', 'd-lg-table-cell')
      this.row.cells[3].classList.add('d-none', 'd-lg-table-cell')
      this.row.cells[4].classList.add('d-none', 'd-lg-table-cell')
      return this.row
   }

   edit() {
      Modal.rebuild('Edit Transaction', true)

      const updateCategoryColor = () => {
         const category = this.budget.categories.get(categorySelect.value)
         if (category) Modal.header.style.backgroundColor = category.accentColor(0.2)
      }
      const categorySelect = create('select', { class: 'form-select' })
      categorySelect.addEventListener('change', () => validateForm() && updateCategoryColor())
      categorySelect.addEventListener('focusin', () => Category.generateSelectOptions(this.budget, categorySelect))
      Category.generateSelectOptions(this.budget, categorySelect)
      categorySelect.value = this.category_uuid
      updateCategoryColor()

      const nameInput = create('input', { type: 'text', class: 'form-control', value: this.name })
      nameInput.addEventListener('input', () => validateForm())

      const amountInput = create('input', { type: 'number', class: 'form-control', value: this.amount, step: '0.01' })
      amountInput.addEventListener('input', () => validateForm())

      const paymentMethodSelect = create('select', { class: 'form-select' })
      paymentMethodSelect.addEventListener('change', () => validateForm())
      paymentMethodSelect.addEventListener('focusin', () => PaymentMethod.generateSelectOptions(this.budget, paymentMethodSelect))
      PaymentMethod.generateSelectOptions(this.budget, paymentMethodSelect)
      paymentMethodSelect.value = this.payment_method_uuid

      const cycleInput = create('input', { type: 'number', class: 'form-control', value: this.billing_cycle[0] })
      cycleInput.addEventListener('input', () => validateForm())
      const cycleSelect = create('select', { class: 'form-select' })
      cycleSelect.addEventListener('change', () => validateForm())
      cycleSelect.options.add(new Option('Select...', '', true, false))
      cycleSelect.options.add(new Option('Day', CYCLE.DAY, false, this.billing_cycle[1] === CYCLE.DAY))
      cycleSelect.options.add(new Option('Week', CYCLE.WEEK, false, this.billing_cycle[1] === CYCLE.WEEK))
      cycleSelect.options.add(new Option('Month', CYCLE.MONTH, false, this.billing_cycle[1] === CYCLE.MONTH))
      cycleSelect.options.add(new Option('Year', CYCLE.YEAR, false, this.billing_cycle[1] === CYCLE.YEAR))

      const payerList = Modal.body.appendChild(create('ul', { class: 'list-group' }))
      const addPayerListItem = (person: Person, amount: number) => {
         const percentInput = create('input', { type: 'number', class: 'form-control', style: 'width: 5em;', 'data-person-uuid': person.uuid, value: this.payers.get(person.uuid) ?? 0 })
         percentInput.addEventListener('input', () => validateForm())
         const deleteButton = Buttons.Delete;
         deleteButton.addEventListener('click', () => deleteButton.closest('li')?.remove())
         payerList.appendChild(create('li', { class: 'list-group-item d-flex justify-content-between align-items-center' }, [
            person.name,
            create('span', { class: 'w-auto d-flex gap-2' }, [
               create('span', { class: 'input-group w-auto' }, [
                  percentInput,
                  create('span', { class: 'input-group-text' }, [Icons.Percent])
               ]),
               deleteButton
            ])
         ]))
      }
      for (const [uuid, amount] of this.payers) {
         const person = this.budget.people.get(uuid)
         if (!person) throw new Error('Person not found')
         addPayerListItem(person, amount)
      }

      const payerSelect = create('select', { class: 'form-select' })
      Person.generateSelectOptions(this.budget, payerSelect)
      const validatePayerSelect = () => {
         const isInvalid = payerSelect.value === '' ||
            [...payerList.querySelectorAll('input[type="number"]').values()]
               .some(input => input.getAttribute('data-person-uuid') === payerSelect.value)
         payerSelect.classList.toggle('is-invalid', isInvalid)
         if (isInvalid) payerSelect.focus()
         return !isInvalid
      }
      payerSelect.addEventListener('change', () => validatePayerSelect())
      const payerAddButton = create('button', { class: 'btn btn-primary' }, [Icons.Plus])
      payerAddButton.addEventListener('click', (event) => {
         event.preventDefault()
         if (validatePayerSelect()) {
            const person = this.budget.people.get(payerSelect.value)
            if (!person) throw new Error('Person not found')
            addPayerListItem(person, 0)
         }
      })

      Modal.body.appendChild(create('form', { class: 'd-flex flex-column gap-2' }, [
         withFloatingLabel('Category', categorySelect),
         withFloatingLabel('Name', nameInput),
         withFloatingLabel('Amount', amountInput),
         withFloatingLabel('Payment Method', paymentMethodSelect),
         create('div', { class: 'input-group' }, [
            withFloatingLabel('Cycle Count', cycleInput),
            withFloatingLabel('Cycle Type', cycleSelect)
         ]),
         create('h5', {}, ['Payers ', create('small', { class: 'text-muted' }, '(Total must be 100%)')]),
         payerList,
         create('div', { class: 'd-flex gap-2' }, [
            payerSelect,
            payerAddButton
         ])
      ]))

      const saveButton = Modal.footer.appendChild(create('button', { class: 'btn btn-success' }, 'Save'))
      saveButton.addEventListener('click', () => {
         if (validateForm()) {
            this.category_uuid = categorySelect.value
            this.name = nameInput.value
            this.amount = +amountInput.value
            this.payment_method_uuid = paymentMethodSelect.value
            this.billing_cycle = [+cycleInput.value, cycleSelect.value as CYCLE]
            this.payers.clear()
            for (const input of payerList.querySelectorAll('input[type="number"]').values())
               if (input.getAttribute('data-person-uuid'))
                  this.payers.set(input.getAttribute('data-person-uuid')!, +input['value'])
            if (!this.budget.transactions.has(this.uuid))
               this.budget.transactions.set(this.uuid, this)
            Modal.hide()
            this.budget.refreshAll()
         }
      })

      Modal.show()

      function validateForm() {
         const results: [HTMLElement, boolean][] = []
         results.push([categorySelect, categorySelect.value !== ''])
         results.push([nameInput, nameInput.value.trim().length >= Transaction.Constraints.Name.MinLength && nameInput.value.trim().length <= Transaction.Constraints.Name.MaxLength])
         results.push([amountInput, !isNaN(+amountInput.value) && +amountInput.value !== 0])
         results.push([paymentMethodSelect, paymentMethodSelect.value !== ''])
         results.push([cycleInput, +cycleInput.value >= Transaction.Constraints.BillingCycle.Min])
         results.push([cycleSelect, cycleSelect.value !== ''])
         results.push([payerSelect, payerList.children.length > 0])
         for (const input of payerList.querySelectorAll('input[type="number"]'))
            results.push([input as HTMLElement, +input['value'] >= 0 && [...payerList.querySelectorAll('input[type="number"]').values()].reduce((acc, input) => acc + +input['value'] || 0, 0) === 100])
         for (const [element, valid] of results) {
            element.classList.toggle('is-invalid', !valid)
            element.classList.toggle('border', !valid)
            element.classList.toggle('border-danger', !valid)
         }
         return results.every(result => result[1])
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
         billing_cycle: this.billing_cycle,
         payers: Object.fromEntries(this.payers)
      }
   }

   static generateSelectOptions(budget: Budget, select: HTMLSelectElement) {
      select.innerHTML = ''
      select.options.add(create('option', { value: '', selected: '', disabled: '', hidden: '' }, 'Transaction'))
      for (const transaction of budget.transactions.values())
         select.options.add(create('option', { value: transaction.uuid }, transaction.name))
   }
}
