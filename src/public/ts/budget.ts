import { Entry } from "./entries/entry.js"
import { PaymentMethod } from "./entries/payment-method.js"
import { Person } from "./entries/person.js"
import { Transaction } from "./entries/transaction.js"
import { Buttons, create, Icons, Tooltips } from "./utils.js"

export class Budget {
   summaryDisplay: HTMLDivElement
   summaryLegend: HTMLDivElement
   summaryProgress: HTMLDivElement
   updateSummary: () => void

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

   downloadButton: HTMLButtonElement
   uploadButton: HTMLButtonElement

   constructor() {
      // Summary
      this.summaryDisplay = create('div', { class: 'd-flex flex-column gap-2 my-3' })
      this.summaryLegend = this.summaryDisplay.appendChild(create('div', { class: 'd-flex justify-content-around align-items-center w-100' }))
      this.summaryProgress = this.summaryDisplay.appendChild(create('div', { class: 'progress-stacked', style: 'height: 2em' }))
      this.updateSummary = () => {
         const totalSalaries = [...this.salaries.values()].reduce((sum, salary) => sum + salary.amount, 0)
         const totalBills = [...this.bills.values()].reduce((sum, bill) => sum + bill.amount, 0)
         const totalNet = totalSalaries + totalBills
         const totalTotals = Math.abs(totalSalaries) + Math.abs(totalBills) + Math.abs(totalNet)
         // Legend
         this.summaryLegend.innerHTML = ''
         this.summaryLegend.append(
            create('span', { class: 'fw-bold' }, [
               create('span', { class: 'text-success' }, [Icons.PieChart]), ` Salaries ($${(totalSalaries).toFixed(2)})`
            ]),
            create('span', { class: 'fw-bold' }, [
               create('span', { class: 'text-danger' }, [Icons.PieChart]), ` Bills ($${totalBills.toFixed(2)})`
            ]),
            create('span', { class: 'fw-bolder' }, [
               create('span', { class: 'text-warning' }, [Icons.PieChart]), ` Net ($${totalNet.toFixed(2)})`
            ])
         )
         // Progress Bar
         this.summaryProgress.innerHTML = ''
         const percentSalaries = Math.abs(totalSalaries) / (totalTotals || 1) * 100
         const percentBills = Math.abs(totalBills) / (totalTotals || 1) * 100
         const percentNet = Math.abs(totalNet) / (totalTotals || 1) * 100
         this.summaryProgress.append(
            create('div', { class: 'progress-bar bg-success', style: `width: ${percentSalaries}%` }, 'Salaries'),
            create('div', { class: 'progress-bar bg-danger', style: `width: ${percentBills}%` }, 'Bills'),
            create('div', { class: 'progress-bar bg-warning', style: `width: ${percentNet}%` }, 'Net')
         )
      }
      // People
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
      // Payment Methods
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
      // Salaries
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
      Transaction.buildForm(this.salariesForm, this, this.salaries)
      this.refreshSalaries = () => {
         this.salariesTBody.innerHTML = ''
         for (const salary of this.salaries.values())
            this.salariesTBody.append(salary.build())
         this.salariesTBody.append(this.salariesForm)
      }
      // Bills
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
      Transaction.buildForm(this.billsForm, this, this.bills)
      this.refreshTransactions = () => {
         this.billsTBody.innerHTML = ''
         for (const transaction of this.bills.values())
            this.billsTBody.append(transaction.build())
         this.billsTBody.append(this.billsForm)
      }
      // Refresh All
      this.refreshAll = () => {
         this.refreshPeople()
         this.refreshPaymentMethods()
         this.refreshSalaries()
         this.refreshTransactions()
         this.updateSummary()
      }
      // Buttons
      this.downloadButton = create('button', { class: 'btn btn-outline-primary ' }, [Icons.Download, ' Download'])
      this.downloadButton.addEventListener('click', () => {
         const data = {
            people: [...this.people.values()].map(person => person.toJson()),
            paymentMethods: [...this.paymentMethods.values()].map(paymentMethod => paymentMethod.toJson()),
            salaries: [...this.salaries.values()].map(salary => salary.toJson()),
            bills: [...this.bills.values()].map(bill => bill.toJson())
         }
         const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
         const url = URL.createObjectURL(blob)
         const a = create('a', { href: url, download: 'budget.json' })
         a.click()
         URL.revokeObjectURL(url)
      })
      this.uploadButton = create('button', { class: 'btn btn-outline-secondary' }, [Icons.Upload, ' Upload'])
      this.uploadButton.addEventListener('click', () => {
         const input = create('input', { type: 'file', accept: 'application/json', style: 'display: none' })
         input.addEventListener('change', () => {
            const file = input.files?.[0]
            if (file) {
               const reader = new FileReader()
               reader.onload = () => {
                  const data = JSON.parse(reader.result as string)
                  for (const person of data.people)
                     this.people.set(person.uuid, new Person(this, person))
                  for (const paymentMethod of data.paymentMethods)
                     this.paymentMethods.set(paymentMethod.uuid, new PaymentMethod(this, paymentMethod))
                  for (const salary of data.salaries)
                     this.salaries.set(salary.uuid, new Transaction(this, salary))
                  for (const bill of data.bills)
                     this.bills.set(bill.uuid, new Transaction(this, bill))
                  this.refreshAll()
               }
               reader.readAsText(file)
            }
         })
         input.click()
      })
   }
}
