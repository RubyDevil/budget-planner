import { budget } from ".."
import { Budget } from "../budget"
import { blendColors, bsIcons, Buttons, create, createInputGroup, Icons, isHexColor, resetForm, Tooltips } from "../utils"
import { Entry, EntryJson } from "./entry"

interface CategoryJson extends EntryJson {
   icon: string
   name: string
   color: string
}

export class Category extends Entry {
   static Constraints = {
      Name: {
         MinLength: 3,
         MaxLength: 12
      }
   }

   icon: string
   name: string
   color: string

   constructor(budget: Budget, data: CategoryJson) {
      super(budget, data)
      this.icon = data.icon
      this.name = data.name
      this.color = data.color ?? '#FFFFFF'
   }

   createIcon(): HTMLElement {
      return create('i', { class: this.icon })
   }

   createLink(): HTMLAnchorElement {
      return create('a', { class: 'text-primary' }, [this.createIcon(), ' ' + this.name])
   }

   accentColor(amount: number = 0.05): string {
      return blendColors("#ffffff", this.color, amount)
   }

   build() {
      this.row.style.backgroundColor = this.accentColor()
      this.row.innerHTML = ''
      // Name and Icon
      this.row.append(create('td', { colspan: 2 }, [this.createIcon(), ' ' + this.name]))
      // Color
      this.row.insertCell().appendChild(create('div', { style: `height: 1em; border: 1px solid black; background-color: ${this.color}` }))
      // Actions
      const actions = this.row.insertCell().appendChild(create('span', { class: 'd-flex gap-2' }))
      actions.appendChild(Buttons.Edit).addEventListener('click', () => this.edit())
      actions.appendChild(Buttons.Delete).addEventListener('click', () => this.delete())
      this.row.querySelectorAll('td')?.forEach(td => td.style.background = 'inherit')
      return this.row
   }

   edit() {
      Category.buildForm(this.row, this.budget, this)
   }

   save() {
      if (Category.validateForm(this.row)) {
         const [iconSelect, nameInput, colorInput] = Category.getFields(this.row)
         this.icon = iconSelect.value
         this.name = nameInput.value
         this.color = colorInput.value
         budget.refreshAll()
      }
   }

   delete() {
      if (confirm('Are you sure you want to delete this entry?')) {
         budget.categories.delete(this.uuid)
         budget.refreshAll()
      }
   }

   toJson(): CategoryJson {
      return {
         uuid: this.uuid,
         icon: this.icon,
         name: this.name,
         color: this.color
      }
   }

   static buildForm(row: HTMLTableRowElement, budget: Budget, editTarget?: Category) {
      row.innerHTML = ''
      // Name and Icon
      const group = row.appendChild(create('td', { colspan: 2 })).appendChild(create('div', { class: 'input-group' }))
      const iconSelect = group
         .appendChild(create('select', { class: 'form-select' }))
      iconSelect.options.add(create('option', { value: '', selected: '', disabled: '', hidden: '' }, 'Icon'))
      for (const iconClass of bsIcons)
         iconSelect.options.add(new Option(iconClass, iconClass, false, iconClass === editTarget?.icon))
      iconSelect.addEventListener('change', this.validateForm.bind(this, row))
      const nameInput = group
         .appendChild(create('input', {
            class: 'form-control',
            type: 'text',
            placeholder: 'Name'
         }))
      nameInput.addEventListener('input', this.validateForm.bind(this, row))
      Tooltips.create(nameInput, 'bottom', `${this.Constraints.Name.MinLength} to ${this.Constraints.Name.MaxLength} characters`)
      // Color
      const colorInput = row.insertCell().appendChild(create('input', {
         class: 'form-control',
         type: 'color',
         value: '#FFFFFF'
      }))
      colorInput.addEventListener('input', this.validateForm.bind(this, row))
      Tooltips.create(colorInput, 'bottom', 'Hexadecimal color in the format #FFFFFF')
      // Actions
      const actions = row.insertCell().appendChild(create('span', { class: 'd-flex gap-2' }))
      if (editTarget) {
         actions.appendChild(Buttons.Save).addEventListener('click', () => editTarget.save())
         actions.appendChild(Buttons.Cancel).addEventListener('click', () => editTarget.build())
      } else {
         actions.appendChild(Buttons.Add).addEventListener('click', (e) => {
            nameInput.value = nameInput.value.trim()
            if (this.validateForm(row)) {
               const uuid = crypto.randomUUID()
               budget.categories.set(uuid, new this(budget, {
                  uuid: uuid,
                  icon: iconSelect.value,
                  name: nameInput.value,
                  color: colorInput.value
               }))
               budget.refreshAll()
               resetForm(row)
            }
         })
      }
      // Data
      if (editTarget) {
         iconSelect.value = editTarget.icon
         nameInput.value = editTarget.name
         colorInput.value = editTarget.color
      }
      row.querySelectorAll('td')?.forEach(td => td.style.background = 'inherit')
      return row
   }

   static getFields(form: HTMLTableRowElement) {
      return [
         form.cells[0].getElementsByTagName('select')[0], // iconSelect
         form.cells[0].getElementsByTagName('input')[0], // nameInput
         form.cells[1].getElementsByTagName('input')[0] // colorInput
      ]
   }

   static validateForm(form: HTMLTableRowElement) {
      const [iconSelect, nameInput, colorInput] = this.getFields(form)
      const results: [HTMLElement, boolean][] = []
      results.push([iconSelect, iconSelect.value !== ''])
      results.push([nameInput, nameInput.value.trim().length >= Category.Constraints.Name.MinLength && nameInput.value.trim().length <= Category.Constraints.Name.MaxLength])
      results.push([colorInput, isHexColor(colorInput.value)])
      for (const [element, valid] of results) {
         element.classList.toggle('is-invalid', !valid)
         element.classList.toggle('is-valid', valid)
      }
      return results.every(result => result[1])
   }

   static generateSelectOptions(budget: Budget, select: HTMLSelectElement) {
      select.innerHTML = ''
      select.options.add(create('option', { value: '', selected: '', disabled: '', hidden: '' }, 'Category'))
      for (const category of budget.categories.values())
         select.options.add(create('option', { value: category.uuid }, category.name))
   }
}
