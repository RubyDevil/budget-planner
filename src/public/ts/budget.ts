import { PaymentMethod } from "./entries/payment-method.js"
import { Person } from "./entries/person.js"
import { Buttons, create, Tooltips } from "./utils.js"

export class Budget {
   people: Person[]
   peopleTable: HTMLTableElement
   peopleTHead: HTMLTableSectionElement
   peopleTBody: HTMLTableSectionElement
   peopleForm: HTMLTableRowElement

   paymentMethods: PaymentMethod[]
   paymentMethodsTable: HTMLTableElement
   paymentMethodsTHead: HTMLTableSectionElement
   paymentMethodsTBody: HTMLTableSectionElement
   paymentMethodsForm: HTMLTableRowElement

   constructor() {
      this.people = []
      this.peopleTable = create('table', { class: 'table table-striped' })
      this.peopleTHead = this.peopleTable.createTHead()
      this.peopleTBody = this.peopleTable.createTBody()
      this.peopleTHead.appendChild(create('tr')).append(
         create('th', { scope: 'col' }, 'Name'),
         create('th', { scope: 'col', class: 'fit' }, 'Actions')
      )
      this.peopleForm = create('tr')
      Person.buildForm(this.peopleForm, this)

      this.paymentMethods = []
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
   }

   // Fetching

   getPerson(uuid: string) {
      return this.people.find(person => person.uuid === uuid)
   }

   getPaymentMethod(uuid: string) {
      return this.paymentMethods.find(paymentMethod => paymentMethod.uuid === uuid)
   }

   // Refreshing

   refreshAll() {
      this.refreshPeople()
      this.refreshPaymentMethods()
   }

   refreshPeople() {
      this.peopleTBody.innerHTML = ''
      for (const person of this.people)
         this.peopleTBody.append(person.build())
      this.peopleTBody.append(this.peopleForm)
   }

   refreshPaymentMethods() {
      this.paymentMethodsTBody.innerHTML = ''
      for (const paymentMethod of this.paymentMethods)
         this.paymentMethodsTBody.append(paymentMethod.build())
      this.paymentMethodsTBody.append(this.paymentMethodsForm)
   }

   // Events

   onPeopleChanged() {
      this.refreshPeople()
      this.refreshPaymentMethods()
   }

   onPaymentMethodsChanged() {
      this.refreshPaymentMethods()
   }
}
