import { Budget } from "./budget.js"
import { Category } from "./entries/category.js"
import { PaymentMethod } from "./entries/payment-method.js"
import { Person } from "./entries/person.js"
import { Transaction } from "./entries/transaction.js"
import { create, Icons } from "./utils.js"

export const budget = new Budget()

const personMe = new Person(budget, { uuid: crypto.randomUUID(), name: 'Me' })
const paymentMethodCash = new PaymentMethod(budget, { uuid: crypto.randomUUID(), name: 'Cash', owner_uuid: personMe.uuid })
const paymentMethodBankAccount = new PaymentMethod(budget, { uuid: crypto.randomUUID(), name: 'Bank Account', owner_uuid: personMe.uuid })
const categorySalaries = new Category(budget, { uuid: crypto.randomUUID(), icon: Icons.CashStack.className, name: 'Salaries' })
const categoryBills = new Category(budget, { uuid: crypto.randomUUID(), icon: Icons.Card.className, name: 'Bills' })
const transactionSalary = new Transaction(budget, { uuid: crypto.randomUUID(), category_uuid: categorySalaries.uuid, name: 'Salary', amount: 5432.10, payment_method_uuid: paymentMethodBankAccount.uuid, billing_cycle: [1, 'month'] })
const transactionRent = new Transaction(budget, { uuid: crypto.randomUUID(), category_uuid: categoryBills.uuid, name: 'Rent', amount: -1234.56, payment_method_uuid: paymentMethodCash.uuid, billing_cycle: [1, 'month'] })
const transactionUnknownIncome = new Transaction(budget, { uuid: crypto.randomUUID(), category_uuid: '...', name: 'Misc (Unknown)', amount: 1500, payment_method_uuid: paymentMethodCash.uuid, billing_cycle: [1, 'month'] })
const transactionUnknownExpense = new Transaction(budget, { uuid: crypto.randomUUID(), category_uuid: '...', name: 'Misc (Unknown)', amount: -150, payment_method_uuid: paymentMethodCash.uuid, billing_cycle: [1, 'month'] })

budget.people.set(personMe.uuid, personMe)
budget.paymentMethods.set(paymentMethodCash.uuid, paymentMethodCash)
budget.paymentMethods.set(paymentMethodBankAccount.uuid, paymentMethodBankAccount)
budget.categories.set(categorySalaries.uuid, categorySalaries)
budget.categories.set(categoryBills.uuid, categoryBills)
budget.transactions.set(transactionSalary.uuid, transactionSalary)
budget.transactions.set(transactionRent.uuid, transactionRent)
budget.transactions.set(transactionUnknownIncome.uuid, transactionUnknownIncome)
budget.transactions.set(transactionUnknownExpense.uuid, transactionUnknownExpense)

budget.refreshAll()

document.getElementById('root')?.append(
   create('div', { class: 'd-flex gap-5' }, [
      create('div', { class: 'flex-fill' }, [
         create('h2', { class: 'fit' }, [Icons.Person, ' People']),
         budget.peopleTable
      ]),
      create('div', { class: 'flex-fill' }, [
         create('h2', { class: 'fit' }, [Icons.Card, ' Payment Methods']),
         budget.paymentMethodsTable
      ])
   ]),
   create('h2', { class: 'fit mt-5' }, [Icons.Bookmarks, ' Categories']),
   budget.categoriesTable,
   create('h2', { class: 'fit mt-5' }, [Icons.Bidirectional, ' Transactions']),
   budget.transactionsTable,
   create('h2', { class: 'fit mt-5' }, [Icons.BarChart, ' Summary']),
   create('div', { class: 'd-flex gap-5 mt-3' }, [
      create('h3', { class: 'flex-grow-1 m-0 text-center' }, 'Income'),
      create('h3', { class: 'flex-grow-1 m-0 text-center' }, 'Expenses')
   ]),
   create('div', { class: 'd-flex gap-5 mb-3' }, [
      budget.summaryIncomeChart,
      budget.summaryExpenseChart,
   ]),
   budget.summaryCumulativeTable,
   create('div', { class: 'd-flex gap-2 justify-content-center w-100 my-5' }, [
      budget.downloadButton,
      budget.uploadButton
   ])
)
