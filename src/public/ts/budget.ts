import { Category } from "./entries/category.js"
import { PaymentMethod } from "./entries/payment-method.js"
import { Person } from "./entries/person.js"
import { Transaction } from "./entries/transaction.js"
import { create, Icons } from "./utils.js"

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

   categories: Map<string, Category>
   categoriesTable: HTMLTableElement
   categoriesTHead: HTMLTableSectionElement
   categoriesTBody: HTMLTableSectionElement
   categoriesForm: HTMLTableRowElement
   refreshCategories: () => void

   transactions: Map<string, Transaction>
   transactionsTable: HTMLTableElement
   transactionsTHead: HTMLTableSectionElement
   transactionsTBody: HTMLTableSectionElement
   transactionsForm: HTMLTableRowElement
   refreshTransactions: () => void

   summaryDisplay: HTMLDivElement
   summaryLegend: HTMLDivElement
   summaryProgress: HTMLDivElement
   summaryDeductionsTable: HTMLTableElement
   summaryDeductionsTHead: HTMLTableSectionElement
   summaryDeductionsTBody: HTMLTableSectionElement
   refreshSummary: () => void

   refreshAll: () => void

   downloadButton: HTMLButtonElement
   uploadButton: HTMLButtonElement

   constructor() {
      // People
      this.people = new Map()
      this.peopleTable = create('table', { class: 'table table-hover' })
      this.peopleTHead = this.peopleTable.createTHead()
      this.peopleTBody = this.peopleTable.createTBody()
      this.peopleTBody.classList.add('table-group-divider')
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
      this.paymentMethodsTable = create('table', { class: 'table table-hover' })
      this.paymentMethodsTHead = this.paymentMethodsTable.createTHead()
      this.paymentMethodsTBody = this.paymentMethodsTable.createTBody()
      this.paymentMethodsTBody.classList.add('table-group-divider')
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
      // Categories
      this.categories = new Map()
      this.categoriesTable = create('table', { class: 'table table-hover' })
      this.categoriesTHead = this.categoriesTable.createTHead()
      this.categoriesTBody = this.categoriesTable.createTBody()
      this.categoriesTBody.classList.add('table-group-divider')
      this.categoriesTHead.appendChild(create('tr')).append(
         create('th', { scope: 'col' }, 'Icon'),
         create('th', { scope: 'col' }, 'Name'),
         create('th', { scope: 'col', class: 'fit' }, 'Actions')
      )
      this.categoriesForm = create('tr')
      Category.buildForm(this.categoriesForm, this)
      this.refreshCategories = () => {
         this.categoriesTBody.innerHTML = ''
         for (const category of this.categories.values())
            this.categoriesTBody.append(category.build())
         this.categoriesTBody.append(this.categoriesForm)
      }
      // Transactions
      this.transactions = new Map()
      this.transactionsTable = create('table', { class: 'table table-hover' })
      this.transactionsTHead = this.transactionsTable.createTHead()
      this.transactionsTBody = this.transactionsTable.createTBody()
      this.transactionsTBody.classList.add('table-group-divider')
      this.transactionsTHead.appendChild(create('tr')).append(
         create('th', { scope: 'col' }, 'Category'),
         create('th', { scope: 'col' }, 'Name'),
         create('th', { scope: 'col' }, 'Amount'),
         create('th', { scope: 'col' }, 'Payment Method'),
         create('th', { scope: 'col', class: 'fit' }, 'Actions')
      )
      this.transactionsForm = create('tr')
      Transaction.buildForm(this.transactionsForm, this, this.transactions)
      this.refreshTransactions = () => {
         this.transactionsTBody.innerHTML = ''
         for (const transaction of this.transactions.values())
            this.transactionsTBody.append(transaction.build())
         this.transactionsTBody.append(this.transactionsForm)
      }
      // Summary
      this.summaryDisplay = create('div', { class: 'd-flex flex-column gap-2 my-3' })
      this.summaryLegend = this.summaryDisplay.appendChild(create('div', { class: 'd-flex justify-content-around align-items-center w-100' }))
      this.summaryProgress = this.summaryDisplay.appendChild(create('div', { class: 'progress-stacked', style: 'height: 2em' }))
      this.summaryDeductionsTable = create('table', { class: 'table table-hover table-borderless table-sm' })
      this.summaryDeductionsTHead = this.summaryDeductionsTable.createTHead()
      this.summaryDeductionsTBody = this.summaryDeductionsTable.createTBody()
      this.summaryDeductionsTBody.classList.add('table-group-divider')
      this.summaryDeductionsTHead.appendChild(create('tr')).append(
         create('th', { scope: 'col' }, 'Deduction'),
         create('th', { scope: 'col' }, 'Amount'),
         create('th', { scope: 'col', class: 'fit' }, 'Remaining'),
      )
      this.refreshSummary = () => {
         // const totalSalaries = [...this.salaries.values()].reduce((sum, salary) => sum + salary.amount, 0)
         // const totalBills = [...this.transactions.values()].reduce((sum, bill) => sum + bill.amount, 0)
         // const totalNet = totalSalaries + totalBills
         // const totalTotals = Math.abs(totalSalaries) + Math.abs(totalBills) + Math.abs(totalNet)
         // // Legend
         // this.summaryLegend.innerHTML = ''
         // this.summaryLegend.append(
         //    create('span', { class: 'fw-bold' }, [
         //       create('span', { class: 'text-success' }, [Icons.PieChart]), ` Salaries ($${(totalSalaries).toFixed(2)})`
         //    ]),
         //    create('span', { class: 'fw-bold' }, [
         //       create('span', { class: 'text-danger' }, [Icons.PieChart]), ` Bills ($${totalBills.toFixed(2)})`
         //    ]),
         //    create('span', { class: 'fw-bolder' }, [
         //       create('span', { class: 'text-secondary' }, [Icons.PieChart]), ` Remaining ($${totalNet.toFixed(2)})`
         //    ])
         // )
         // // Progress Bar
         // this.summaryProgress.innerHTML = ''
         // const percentSalaries = Math.abs(totalSalaries) / (totalTotals || 1) * 100
         // const percentBills = Math.abs(totalBills) / (totalTotals || 1) * 100
         // const percentNet = Math.abs(totalNet) / (totalTotals || 1) * 100
         // this.summaryProgress.append(
         //    create('div', { class: 'progress-bar bg-success', style: `width: ${percentSalaries}%` }, 'Salaries'),
         //    create('div', { class: 'progress-bar bg-danger', style: `width: ${percentBills}%` }, 'Bills'),
         //    create('div', { class: 'progress-bar bg-secondary', style: `width: ${percentNet}%` }, 'Remaining')
         // )
      }
      // Refresh All
      this.refreshAll = () => {
         this.refreshPeople()
         this.refreshPaymentMethods()
         this.refreshCategories()
         this.refreshTransactions()
         this.refreshSummary()
      }
      // Buttons
      this.downloadButton = create('button', { class: 'btn btn-outline-primary ' }, [Icons.Download, ' Download'])
      this.downloadButton.addEventListener('click', () => {
         const data = {
            people: [...this.people.values()].map(person => person.toJson()),
            paymentMethods: [...this.paymentMethods.values()].map(paymentMethod => paymentMethod.toJson()),
            transactions: [...this.transactions.values()].map(transaction => transaction.toJson())
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
                  for (const transaction of data.transactions)
                     this.transactions.set(transaction.uuid, new Transaction(this, transaction))
                  this.refreshAll()
               }
               reader.readAsText(file)
            }
         })
         input.click()
      })
      // Refresh
      this.refreshAll()
   }
}
