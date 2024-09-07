import { Entry } from "./entries/entry.js"
import { PaymentMethod } from "./entries/payment-method.js"
import { Person } from "./entries/person.js"
import { Transaction } from "./entries/transaction.js"
import { Buttons, create, Icons, Tooltips } from "./utils.js"

export class Budget {
   people: Map<string, Person>
   peopleTable: HTMLTableElement
   peopleTHead: HTMLTableSectionElement
   peopleTBody: HTMLTableSectionElement
   peopleForm: HTMLTableRowElement
   refreshPeople: () => void

   paymentMethods: Map<string, PaymentMethod>
   paymentMethodsTable: HTMLTableElement
   paymentMethodsTHead: HTMLTableSectionElement
   paymentMethodsTBody: HTMLTableSectionElement
   paymentMethodsForm: HTMLTableRowElement
   refreshPaymentMethods: () => void

   salaries: Map<string, Transaction>
   salariesTable: HTMLTableElement
   salariesTHead: HTMLTableSectionElement
   salariesTBody: HTMLTableSectionElement
   salariesForm: HTMLTableRowElement
   refreshSalaries: () => void

   bills: Map<string, Transaction>
   billsTable: HTMLTableElement
   billsTHead: HTMLTableSectionElement
   billsTBody: HTMLTableSectionElement
   billsForm: HTMLTableRowElement
   refreshTransactions: () => void

   refreshAll: () => void

   saveButton: HTMLButtonElement

   constructor() {
      this.people = new Map()
      this.peopleTable = create('table', { class: 'table table-striped' })
      this.peopleTHead = this.peopleTable.createTHead()
      this.peopleTBody = this.peopleTable.createTBody()
      this.peopleTHead.appendChild(create('tr')).append(
         create('th', { scope: 'col' }, 'Name'),
         create('th', { scope: 'col', class: 'fit' }, 'Actions')
      )
      this.peopleForm = create('tr')
      Person.buildForm(this.peopleForm, this)
      this.refreshPeople = () => {
         this.peopleTBody.innerHTML = ''
         for (const person of this.people.values())
            this.peopleTBody.append(person.build())
         this.peopleTBody.append(this.peopleForm)
      }

      this.paymentMethods = new Map()
      this.paymentMethodsTable = create('table', { class: 'table table-striped' })
      this.paymentMethodsTHead = this.paymentMethodsTable.createTHead()
      this.paymentMethodsTBody = this.paymentMethodsTable.createTBody()
      this.paymentMethodsTHead.appendChild(create('tr')).append(
         create('th', { scope: 'col' }, 'Name'),
         create('th', { scope: 'col' }, 'Owner'),
         create('th', { scope: 'col', class: 'fit' }, 'Actions')
      )
      this.paymentMethodsForm = create('tr')
      PaymentMethod.buildForm(this.paymentMethodsForm, this)
      this.refreshPaymentMethods = () => {
         this.paymentMethodsTBody.innerHTML = ''
         for (const paymentMethod of this.paymentMethods.values())
            this.paymentMethodsTBody.append(paymentMethod.build())
         this.paymentMethodsTBody.append(this.paymentMethodsForm)
      }

      this.salaries = new Map()
      this.salariesTable = create('table', { class: 'table table-striped' })
      this.salariesTHead = this.salariesTable.createTHead()
      this.salariesTBody = this.salariesTable.createTBody()
      this.salariesTHead.appendChild(create('tr')).append(
         create('th', { scope: 'col' }, 'Name'),
         create('th', { scope: 'col' }, 'Amount'),
         create('th', { scope: 'col' }, 'Deposited To'),
         create('th', { scope: 'col', class: 'fit' }, 'Actions')
      )
      this.salariesForm = create('tr')
      Transaction.buildForm(this.salariesForm, this)
      this.refreshSalaries = () => {
         this.salariesTBody.innerHTML = ''
         for (const salary of this.salaries.values())
            this.salariesTBody.append(salary.build())
         this.salariesTBody.append(this.salariesForm)
      }

      this.bills = new Map()
      this.billsTable = create('table', { class: 'table table-striped' })
      this.billsTHead = this.billsTable.createTHead()
      this.billsTBody = this.billsTable.createTBody()
      this.billsTHead.appendChild(create('tr')).append(
         create('th', { scope: 'col' }, 'Name'),
         create('th', { scope: 'col' }, 'Amount'),
         create('th', { scope: 'col' }, 'Billed From'),
         create('th', { scope: 'col', class: 'fit' }, 'Actions')
      )
      this.billsForm = create('tr')
      Transaction.buildForm(this.billsForm, this)
      this.refreshTransactions = () => {
         this.billsTBody.innerHTML = ''
         for (const transaction of this.bills.values())
            this.billsTBody.append(transaction.build())
         this.billsTBody.append(this.billsForm)
      }

      this.refreshAll = () => {
         this.refreshPeople()
         this.refreshPaymentMethods()
         this.refreshSalaries()
         this.refreshTransactions()
      }

      // <button id="upload" class="btn btn-primary my-5"><i class="bi bi-cloud-arrow-up-fill"></i> Save</button>
      this.saveButton = create('button', { class: 'btn btn-primary my-5' }, [Icons.Upload, ' Save'])
   }

   // Events

   onPeopleChanged() {
      this.refreshPeople()
      this.refreshPaymentMethods()
   }

   onPaymentMethodsChanged() {
      this.refreshPaymentMethods()
      this.refreshTransactions()
   }

   onTransactionsChanged() {
      this.refreshTransactions()
   }
}
