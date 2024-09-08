import { Budget } from "./budget.js"
import { Category } from "./entries/category.js"
import { create, Icons } from "./utils.js"

export const budget = new Budget()

const defaultCategory = new Category(budget, { uuid: crypto.randomUUID(), icon: 'bi-credit-card', name: 'Bills' })
budget.categories.set(defaultCategory.uuid, defaultCategory)

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
   create('h2', { class: 'fit' }, [Icons.Bookmarks, ' Categories']),
   budget.categoriesTable,
   create('h2', { class: 'fit' }, [Icons.Wrench, ' Transactions']),
   budget.transactionsTable,
   create('h2', { class: 'fit' }, [Icons.BarChart, ' Summary']),
   budget.summaryDisplay,
   budget.summaryDeductionsTable,
   create('div', { class: 'd-flex gap-2 justify-content-center w-100 mt-5' }, [
      budget.downloadButton,
      budget.uploadButton
   ])
)
