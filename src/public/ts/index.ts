import { Budget } from "./budget.js"
import { create, Icons } from "./utils.js"

export const budget = new Budget()

document.getElementById('root')?.append(
   create('h2', { class: 'fit' }, [Icons.BarChart, ' Summary']),
   budget.summaryDisplay,
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
   create('div', { class: 'd-flex gap-2 justify-content-center w-100 mt-5' }, [
      budget.downloadButton,
      budget.uploadButton
   ])
)
