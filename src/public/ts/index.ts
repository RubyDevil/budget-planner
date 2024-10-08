import { Budget } from "./budget.js"
import { Category } from "./entries/category.js"
import { CYCLE } from "./entries/cycle.js"
import { PaymentMethod } from "./entries/payment-method.js"
import { Person } from "./entries/person.js"
import { Transaction } from "./entries/transaction.js"
import { Icons } from "./utils.js"

export const budget = new Budget()

const personMe = new Person(budget, { uuid: crypto.randomUUID(), name: 'Me' })
const paymentMethodCash = new PaymentMethod(budget, { uuid: crypto.randomUUID(), name: 'Cash', owner_uuid: personMe.uuid })
const paymentMethodBankAccount = new PaymentMethod(budget, { uuid: crypto.randomUUID(), name: 'Bank Account', owner_uuid: personMe.uuid })
const categorySalaries = new Category(budget, { uuid: crypto.randomUUID(), icon: Icons.CashStack.className, name: 'Salaries' })
const categoryBills = new Category(budget, { uuid: crypto.randomUUID(), icon: Icons.Card.className, name: 'Bills' })
const transactionSalary = new Transaction(budget, { uuid: crypto.randomUUID(), category_uuid: categorySalaries.uuid, name: 'Salary', amount: 5432.10, payment_method_uuid: paymentMethodBankAccount.uuid, billing_cycle: [1, CYCLE.MONTH] })
const transactionRent = new Transaction(budget, { uuid: crypto.randomUUID(), category_uuid: categoryBills.uuid, name: 'Rent', amount: -1234.56, payment_method_uuid: paymentMethodCash.uuid, billing_cycle: [1, CYCLE.MONTH] })
const transactionUnknownIncome = new Transaction(budget, { uuid: crypto.randomUUID(), category_uuid: '...', name: 'Misc (Unknown)', amount: 1500, payment_method_uuid: paymentMethodCash.uuid, billing_cycle: [1, CYCLE.MONTH] })
const transactionUnknownExpense = new Transaction(budget, { uuid: crypto.randomUUID(), category_uuid: '...', name: 'Misc (Unknown)', amount: -150, payment_method_uuid: paymentMethodCash.uuid, billing_cycle: [1, CYCLE.MONTH] })

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

const root = document.getElementById('root')
if (root)
   budget.render(root)
