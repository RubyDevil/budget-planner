import { Category } from "./entries/category.js"
import { CYCLE, CYCLE_DAYS } from "./entries/cycle.js"
import { Entry } from "./entries/entry.js"
import { PaymentMethod } from "./entries/payment-method.js"
import { Person } from "./entries/person.js"
import { Transaction } from "./entries/transaction.js"
import { create, formatMoney, formatMoneyCell, goToElement, Icons, Tooltips } from "./utils.js"

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

   summaryCycleInput: HTMLInputElement
   summaryCycleSelect: HTMLSelectElement
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
   validateSummaryCycleChange: () => void

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
         create('th', { scope: 'col' }, 'Color'),
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
                  create('th', { colspan: 6, class: 'text-center', style: `background-color: ${category.accentColor(0.1)}` }, category.name)
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
      const cycleGroup = create('div', { class: 'input-group' })
      this.summaryCycleInput = cycleGroup
         .appendChild(create('input', {
            class: 'form-control',
            type: 'number',
            placeholder: 'Count',
            step: '1',
            min: '1',
            value: '1'
         }))
      this.summaryCycleInput.addEventListener('input', () => this.validateSummaryCycleChange())
      Tooltips.create(this.summaryCycleInput, 'bottom', 'Number of days, weeks, months, or years. Must be greater than 0.')
      this.summaryCycleSelect = cycleGroup.appendChild(create('select', { class: 'form-select' }))
      this.summaryCycleSelect.options.add(new Option('Day', CYCLE.DAY, false, false))
      this.summaryCycleSelect.options.add(new Option('Week', CYCLE.WEEK, false, false))
      this.summaryCycleSelect.options.add(new Option('Month', CYCLE.MONTH, true, true))
      this.summaryCycleSelect.options.add(new Option('Year', CYCLE.YEAR, false, false))
      this.summaryCycleSelect.addEventListener('change', () => this.validateSummaryCycleChange())
      this.validateSummaryCycleChange = () => {
         console.log(+this.summaryCycleInput.value)
         if (!this.summaryCycleInput.value || +this.summaryCycleInput.value < 1)
            return this.summaryCycleInput.classList.add('is-invalid')
         else {
            this.summaryCycleInput.classList.remove('is-invalid')
            this.refreshSummary()
         }
      }
      this.summaryCumulativeTable = create('table', { class: 'table table-hover mt-3' })
      this.summaryCumulativeTHead = this.summaryCumulativeTable.createTHead()
      this.summaryCumulativeTBody = this.summaryCumulativeTable.createTBody()
      this.summaryCumulativeTHead.appendChild(create('tr')).append(
         create('th', { scope: 'col' }, 'Category'),
         create('th', { scope: 'col' }, 'Subtotal'),
         create('th', { scope: 'col', class: 'fit' }, 'Cumulative'),
      )
      this.summaryIncomeChart = create('div', { class: 'd-flex flex-column gap-2 my-3 flex-grow-1' })
      this.summaryIncomeChartLegend = this.summaryIncomeChart.appendChild(create('div', { class: 'd-flex justify-content-around align-items-center w-100' }))
      this.summaryIncomeChartProgressBar = this.summaryIncomeChart.appendChild(create('div', { class: 'progress-stacked', style: 'height: 2em' }))
      this.summaryExpenseChart = create('div', { class: 'd-flex flex-column gap-2 my-3 flex-grow-1' })
      this.summaryExpenseChartLegend = this.summaryExpenseChart.appendChild(create('div', { class: 'd-flex justify-content-around align-items-center w-100' }))
      this.summaryExpenseChartProgressBar = this.summaryExpenseChart.appendChild(create('div', { class: 'progress-stacked', style: 'height: 2em' }))
      this.refreshSummary = () => {
         const cycleDays = CYCLE_DAYS[this.summaryCycleSelect.value as CYCLE] * +this.summaryCycleInput.value
         this.summaryCumulativeTBody.innerHTML = ''
         this.summaryIncomeChartLegend.innerHTML = ''
         this.summaryIncomeChartProgressBar.innerHTML = ''
         this.summaryExpenseChartLegend.innerHTML = ''
         this.summaryExpenseChartProgressBar.innerHTML = ''
         const totalIncome = [...this.transactions.values()]
            .filter(transaction => transaction.amountPer(cycleDays) > 0)
            .reduce((total, transaction) => total + transaction.amountPer(cycleDays), 0)
         const totalExpense = [...this.transactions.values()]
            .filter(transaction => transaction.amountPer(cycleDays) < 0)
            .reduce((total, transaction) => total + transaction.amountPer(cycleDays), 0)
         const cumulativeSubtotals = [...this.calculateSubtotals(cycleDays).entries()].sort((a, b) => b[1] - a[1])
         const incomeSubtotals = [...this.calculateSubtotals(cycleDays, transaction => transaction.amountPer(cycleDays) <= 0).entries()].sort((a, b) => b[1] - a[1])
         const expenseSubtotals = [...this.calculateSubtotals(cycleDays, transaction => transaction.amountPer(cycleDays) >= 0).entries()].sort((a, b) => b[1] - a[1])
         // Cumulative Table
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

   render(root: HTMLElement) {
      root.append(
         create('div', { class: 'd-flex gap-5' }, [
            create('div', { class: 'flex-fill' }, [
               create('h2', { class: 'fit' }, [Icons.Person, ' People']),
               this.peopleTable
            ]),
            create('div', { class: 'flex-fill' }, [
               create('h2', { class: 'fit' }, [Icons.Card, ' Payment Methods']),
               this.paymentMethodsTable
            ])
         ]),
         create('h2', { class: 'fit mt-5' }, [Icons.Bookmarks, ' Categories']),
         this.categoriesTable,
         create('a', { href: 'https://icons.getbootstrap.com/#icons', target: '_blank' }, 'See the full list of icons'),
         create('h2', { class: 'fit mt-5' }, [Icons.Bidirectional, ' Transactions']),
         this.transactionsTable,
         create('div', { class: 'd-flex gap-3 mt-5' }, [
            create('h2', { style: 'white-space: nowrap' }, [Icons.BarChart, ' Summary']),
            create('div', { class: 'input-group w-auto' }, [
               this.summaryCycleInput,
               this.summaryCycleSelect
            ])
         ]),
         this.summaryCumulativeTable,
         create('div', { class: 'd-flex gap-5 mt-3' }, [
            create('h3', { class: 'flex-grow-1 m-0 text-center' }, 'Income'),
            create('h3', { class: 'flex-grow-1 m-0 text-center' }, 'Expenses')
         ]),
         create('div', { class: 'd-flex gap-5 mb-3' }, [
            this.summaryIncomeChart,
            this.summaryExpenseChart,
         ]),
         create('div', { class: 'd-flex gap-2 justify-content-center w-100 my-5' }, [
            this.downloadButton,
            this.uploadButton
         ])
      )
   }

   calculateSubtotals(cycleDays: number, excludeFilter?: (transaction: Transaction) => boolean): Map<string, number> {
      return new Map(
         [...new Set([
            ...[...this.categories.values()].map(category => category.uuid),
            ...[...this.transactions.values()].map(transaction => transaction.category_uuid)
         ]).values()]
            .map(categoryUUID => [
               categoryUUID,
               [...this.transactions.values()]
                  .filter(transaction => transaction.category_uuid === categoryUUID)
                  .reduce((total, transaction) => excludeFilter?.(transaction) ? total : total + transaction.amountPer(cycleDays), 0)
            ])
      )
   }
}
