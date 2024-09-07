import { API } from "./api.js"
import { Budget } from "./budget.js"
import { PaymentMethod } from "./entries/payment-method.js"
import { Person } from "./entries/person.js"
import { create, Icons } from "./utils.js"

export const budget = new Budget()

const uuids = new Array(4).fill(null).map(() => crypto.randomUUID())
budget.people.set(uuids[0], new Person(budget, { uuid: uuids[0], name: 'Nakitia' }))
budget.people.set(uuids[1], new Person(budget, { uuid: uuids[1], name: 'Ulric' }))
budget.paymentMethods.set(uuids[2], new PaymentMethod(budget, { uuid: uuids[2], name: 'TD Debit ****1463', owner_uuid: uuids[0] }))
budget.paymentMethods.set(uuids[3], new PaymentMethod(budget, { uuid: uuids[3], name: 'TD Credit ****9579', owner_uuid: uuids[1] }))

budget.refreshAll()

document.getElementById('root')?.append(
   create('div', { class: 'd-flex gap-4' }, [
      create('div', { class: 'flex-fill' }, [
         create('h2', { class: 'fit' }, [Icons.Person, ' People']),
         budget.peopleTable
      ]),
      create('div', { class: 'flex-fill' }, [
         create('h2', { class: 'fit' }, [Icons.Card, ' Payment Methods']),
         budget.paymentMethodsTable
      ])
   ]),
   create('h2', { class: 'fit' }, [Icons.Briefcase, ' Salaries']),
   budget.salariesTable,
   create('h2', { class: 'fit' }, [Icons.Wrench, ' Bills']),
   budget.billsTable,
   budget.saveButton
)
