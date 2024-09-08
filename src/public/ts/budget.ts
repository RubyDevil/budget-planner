import { Category } from "./entries/category.js"
import { Entry } from "./entries/entry.js"
import { PaymentMethod } from "./entries/payment-method.js"
import { Person } from "./entries/person.js"
import { Transaction } from "./entries/transaction.js"
import { create, formatMoney, formatMoneyCell, goToElement, Icons } from "./utils.js"

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

   summaryIncomeChart: HTMLDivElement
   summaryIncomeChartLegend: HTMLDivElement
   summaryIncomeChartProgressBar: HTMLDivElement
   summaryExpenseChart: HTMLDivElement
   summaryExpenseChartLegend: HTMLDivElement
   summaryExpenseChartProgressBar: HTMLDivElement
   summaryCumulativeTable: HTMLTableElement
   summaryCumulativeTHead: HTMLTableSectionElement
   summaryCumulativeTBody: HTMLTableSectionElement
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
      this.categoriesTHead.appendChild(create('tr')).append(
         create('th', { scope: 'col', colspan: 2 }, 'Name'),
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
      this.transactionsTHead.appendChild(create('tr', { style: 'white-space: nowrap' })).append(
         create('th', { scope: 'col', class: 'fit' }, 'Category'),
         create('th', { scope: 'col', class: 'fit' }, 'Name'),
         create('th', { scope: 'col', class: 'fit' }, 'Amount'),
         create('th', { scope: 'col', class: 'fit' }, 'Payment Method'),
         create('th', { scope: 'col', class: 'fit' }, 'Billing Cycle'),
         create('th', { scope: 'col', class: 'fit' }, 'Actions')
      )
      this.transactionsForm = create('tr')
      Transaction.buildForm(this.transactionsForm, this, this.transactions)
      this.refreshTransactions = () => {
         this.transactionsTBody.innerHTML = ''
         for (const category of this.categories.values()) {
            const transactions = [...this.transactions.values()].filter(transaction => transaction.category_uuid === category.uuid)
            if (transactions.length) {
               this.transactionsTBody.append(create('tr', {}, [
                  create('th', { colspan: 6, class: 'text-center bg-body-tertiary' }, category.name)
               ]))
               for (const transaction of transactions)
                  this.transactionsTBody.append(transaction.build())
            }
         }
         const unknownCategoryTransactions = [...this.transactions.values()].filter(transaction => !this.categories.has(transaction.category_uuid))
         if (unknownCategoryTransactions.length) {
            this.transactionsTBody.append(create('tr', {}, [
               create('th', { colspan: 6, class: 'text-center bg-body-tertiary' }, 'Unknown')
            ]))
            for (const transaction of unknownCategoryTransactions)
               this.transactionsTBody.append(transaction.build())
         }
         this.transactionsTBody.append(this.transactionsForm)
      }
      // Summary
      this.summaryIncomeChart = create('div', { class: 'd-flex flex-column gap-2 my-3 flex-grow-1' })
      this.summaryIncomeChartLegend = this.summaryIncomeChart.appendChild(create('div', { class: 'd-flex justify-content-around align-items-center w-100' }))
      this.summaryIncomeChartProgressBar = this.summaryIncomeChart.appendChild(create('div', { class: 'progress-stacked', style: 'height: 2em' }))
      this.summaryExpenseChart = create('div', { class: 'd-flex flex-column gap-2 my-3 flex-grow-1' })
      this.summaryExpenseChartLegend = this.summaryExpenseChart.appendChild(create('div', { class: 'd-flex justify-content-around align-items-center w-100' }))
      this.summaryExpenseChartProgressBar = this.summaryExpenseChart.appendChild(create('div', { class: 'progress-stacked', style: 'height: 2em' }))
      this.summaryCumulativeTable = create('table', { class: 'table table-hover' })
      this.summaryCumulativeTHead = this.summaryCumulativeTable.createTHead()
      this.summaryCumulativeTBody = this.summaryCumulativeTable.createTBody()
      this.summaryCumulativeTHead.appendChild(create('tr')).append(
         create('th', { scope: 'col' }, 'Category'),
         create('th', { scope: 'col' }, 'Subtotal'),
         create('th', { scope: 'col', class: 'fit' }, 'Cumulative'),
      )
      this.refreshSummary = () => {
         this.summaryIncomeChartLegend.innerHTML = ''
         this.summaryIncomeChartProgressBar.innerHTML = ''
         this.summaryExpenseChartLegend.innerHTML = ''
         this.summaryExpenseChartProgressBar.innerHTML = ''
         this.summaryCumulativeTBody.innerHTML = ''
         const totalIncome = [...this.transactions.values()]
            .filter(transaction => transaction.amount > 0)
            .reduce((total, transaction) => total + transaction.amount, 0)
         const totalExpense = [...this.transactions.values()]
            .filter(transaction => transaction.amount < 0)
            .reduce((total, transaction) => total + transaction.amount, 0)
         const cumulativeSubtotals = [...this.calculateSubtotals().entries()].sort((a, b) => b[1] - a[1])
         const incomeSubtotals = [...this.calculateSubtotals(transaction => transaction.amount <= 0).entries()].sort((a, b) => b[1] - a[1])
         const expenseSubtotals = [...this.calculateSubtotals(transaction => transaction.amount >= 0).entries()].sort((a, b) => b[1] - a[1])
         // Income
         var unknownSubtotal = 0
         for (const [categoryUUID, subtotal] of incomeSubtotals) {
            const category = this.categories.get(categoryUUID)
            if (category === undefined) unknownSubtotal += subtotal
            else {
               if (subtotal === 0) continue
               const percent = Math.abs(subtotal) / (Math.abs(totalIncome) || 1) * 100
               this.summaryIncomeChartLegend.append(create('span', {}, [create('span', { class: 'text-success' }, [Icons.PieChart]), ` ${category.name} (${formatMoney(subtotal)})`]))
               this.summaryIncomeChartProgressBar.append(create('div', { class: 'progress-bar bg-success', style: `width: ${percent}%` }, category.name))
            }
         }
         if (unknownSubtotal !== 0) {
            const percent = Math.abs(unknownSubtotal) / (Math.abs(totalIncome) || 1) * 100
            this.summaryIncomeChartLegend.append(create('span', {}, [create('span', {}, [Icons.PieChart]), ` Unknown (${formatMoney(unknownSubtotal)})`]))
            this.summaryIncomeChartProgressBar.append(create('div', { class: 'progress-bar bg-dark', style: `width: ${percent}%` }, 'Unknown'))
         }
         // Expense
         var unknownSubtotal = 0
         for (const [categoryUUID, subtotal] of expenseSubtotals) {
            const category = this.categories.get(categoryUUID)
            if (category === undefined) unknownSubtotal += subtotal
            else {
               if (subtotal === 0) continue
               const percent = Math.abs(subtotal) / (Math.abs(totalExpense) || 1) * 100
               this.summaryExpenseChartLegend.append(create('span', {}, [create('span', { class: 'text-danger' }, [Icons.PieChart]), ` ${category.name} (${formatMoney(subtotal)})`]))
               this.summaryExpenseChartProgressBar.append(create('div', { class: 'progress-bar bg-danger', style: `width: ${percent}%` }, category.name))
            }
         }
         if (unknownSubtotal !== 0) {
            const percent = Math.abs(unknownSubtotal) / (Math.abs(totalExpense) || 1) * 100
            this.summaryExpenseChartLegend.append(create('span', {}, [create('span', {}, [Icons.PieChart]), ` Unknown (${formatMoney(unknownSubtotal)})`]))
            this.summaryExpenseChartProgressBar.append(create('div', { class: 'progress-bar bg-dark', style: `width: ${percent}%` }, 'Unknown'))
         }
         // Cumulative
         let cumulative = 0
         var unknownSubtotal = 0
         for (const [categoryUUID, subtotal] of cumulativeSubtotals) {
            const category = this.categories.get(categoryUUID)
            if (category === undefined) unknownSubtotal += subtotal
            else {
               if (subtotal === 0) continue
               else cumulative += subtotal
               const row = this.summaryCumulativeTBody.insertRow()
               row.insertCell().appendChild(create('a', { class: 'text-primary' }, [category.createIcon(), ' ' + category.name]))
                  .addEventListener('click', (e) => goToElement(category.row))
               formatMoneyCell(row.insertCell(), subtotal, true)
               formatMoneyCell(row.insertCell(), cumulative, false)
            }
         }
         if (unknownSubtotal !== 0) {
            const row = this.summaryCumulativeTBody.insertRow()
            row.insertCell().appendChild(Entry.unknownLink())
            formatMoneyCell(row.insertCell(), unknownSubtotal, true)
            formatMoneyCell(row.insertCell(), cumulative + unknownSubtotal, false)
         }
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
      this.downloadButton = create('button', { class: 'btn btn-primary ' }, [Icons.Download, ' Download'])
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
      this.uploadButton = create('button', { class: 'btn btn-secondary' }, [Icons.Upload, ' Upload'])
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

   calculateSubtotals(excludeFilter?: (transaction: Transaction) => boolean): Map<string, number> {
      return new Map(
         [...new Set([
            ...[...this.categories.values()].map(category => category.uuid),
            ...[...this.transactions.values()].map(transaction => transaction.category_uuid)
         ]).values()]
            .map(categoryUUID => [
               categoryUUID,
               [...this.transactions.values()]
                  .filter(transaction => transaction.category_uuid === categoryUUID)
                  .reduce((total, transaction) => excludeFilter?.(transaction) ? total : total + transaction.amount, 0)
            ])
      )
   }
}
