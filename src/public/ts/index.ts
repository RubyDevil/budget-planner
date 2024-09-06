import { API } from "./api.js"
import { Budget } from "./budget.js"
import { PaymentMethod } from "./entries/payment-method.js"
import { Person } from "./entries/person.js"
import { create } from "./utils.js"

export const budget = new Budget()

budget.people = [
   new Person(budget, { uuid: crypto.randomUUID(), name: 'Nakitia' }),
   new Person(budget, { uuid: crypto.randomUUID(), name: 'Ulric' })
]
budget.paymentMethods = [
   new PaymentMethod(budget, { uuid: crypto.randomUUID(), name: 'TD Debit ****1463', owner_uuid: budget.people[0].uuid }),
   new PaymentMethod(budget, { uuid: crypto.randomUUID(), name: 'TD Credit ****9579', owner_uuid: budget.people[1].uuid })
]

budget.refreshAll()

document.getElementById('root')?.append(
   create('h2', { class: 'fit' }, 'People'),
   budget.peopleTable,
   create('h2', { class: 'fit' }, 'Payment Methods'),
   budget.paymentMethodsTable
)