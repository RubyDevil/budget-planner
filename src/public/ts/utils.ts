export function create<T extends keyof HTMLElementTagNameMap>(tagName: T, attributes?: object, content?: string | (string | HTMLElement)[]): HTMLElementTagNameMap[T] {
   const element = document.createElement(tagName)
   if (attributes)
      for (const key in attributes)
         element.setAttribute(key, attributes[key])
   if (content)
      if (typeof content === 'string') element.textContent = content
      else for (const child of content)
         if (typeof child === 'string') element.appendChild(document.createTextNode(child))
         else element.appendChild(child)
   return element
}

export function createInputGroup(icon: HTMLElement) {
   const inputGroup = create('div', { class: 'input-group' })
   inputGroup.appendChild(create('span', { class: 'input-group-text' }, [icon]))
   return inputGroup
}

export function formatMoneyCell(cell: HTMLTableCellElement, money: number, autoColor?: boolean) {
   if (autoColor)
      cell.classList.add('monospace', money >= 0 ? 'text-success' : 'text-danger')
   cell.textContent = formatMoney(money, true)
   return cell
}

export function formatMoney(money: number, positiveSign?: boolean) {
   return (positiveSign && money >= 0 ? '+' : '') + money.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

export const Icons = {
   get Plus() { return create('i', { class: 'bi-plus-lg' }) },
   get Minus() { return create('i', { class: 'bi-dash-lg' }) },
   get Check() { return create('i', { class: 'bi-check-lg' }) },
   get Cross() { return create('i', { class: 'bi-x-lg' }) },
   get Edit() { return create('i', { class: 'bi-pencil-fill' }) },
   get Save() { return create('i', { class: 'bi-floppy-fill' }) },
   get Trash() { return create('i', { class: 'bi-trash-fill' }) },
   get Nametag() { return create('i', { class: 'bi-tag-fill' }) },
   get Person() { return create('i', { class: 'bi-person-fill' }) },
   get Dollar() { return create('i', { class: 'bi-currency-dollar' }) },
   get Card() { return create('i', { class: 'bi-credit-card-fill' }) },
   get ID() { return create('i', { class: 'bi-person-vcard-fill' }) },
   get Bag() { return create('i', { class: 'bi-bag-fill' }) },
   get Briefcase() { return create('i', { class: 'bi-briefcase-fill' }) },
   get Wrench() { return create('i', { class: 'bi-wrench-adjustable' }) },
   get Coin() { return create('i', { class: 'bi-coin' }) },
   get CashCoin() { return create('i', { class: 'bi-cash-coin' }) },
   get CashStack() { return create('i', { class: 'bi-cash-stack' }) },
   get Vault() { return create('i', { class: 'bi-safe2-fill' }) },
   get Upload() { return create('i', { class: 'bi-cloud-arrow-up-fill' }) },
   get Upload2() { return create('i', { class: 'bi-cloud-upload-fill' }) },
   get Download() { return create('i', { class: 'bi-cloud-arrow-down-fill' }) },
   get Download2() { return create('i', { class: 'bi-cloud-download-fill' }) },
   get PieChart() { return create('i', { class: 'bi-pie-chart-fill' }) },
   get BarChart() { return create('i', { class: 'bi-bar-chart-line-fill' }) },
   get NestedList() { return create('i', { class: 'bi-list-nested' }) },
   get Bookmarks() { return create('i', { class: 'bi-bookmarks-fill' }) },
   get QuestionMarkCloud() { return create('i', { class: 'bi-patch-question-fill' }) },
   get Bidirectional() { return create('i', { class: 'bi-arrow-left-right' }) },
}

export const Buttons = {
   get Edit() { return create('button', { class: 'btn btn-outline-secondary' }, [Icons.Edit]) },
   get Save() { return create('button', { class: 'btn btn-outline-success' }, [Icons.Save]) },
   get Delete() { return create('button', { class: 'btn btn-outline-danger' }, [Icons.Trash]) },
   get Cancel() { return create('button', { class: 'btn btn-outline-warning' }, [Icons.Cross]) },
   get Add() { return create('button', { class: 'btn btn-outline-primary' }, [Icons.Plus]) },
}

export class Tooltips {
   static list: bootstrap.Tooltip[] = []

   static create(element: HTMLElement, placement: 'top' | 'bottom' | 'left' | 'right' = 'top', title: string) {
      // @ts-expect-error: UMD Global Bootstrap
      const tooltip = new bootstrap.Tooltip(element, {
         title: title,
         placement: placement,
         trigger: 'hover focus',
         html: true
      })
      this.list.push(tooltip)
   }
}

export function resetForm(form: HTMLElement) {
   [
      ...form.querySelectorAll('input'),
      ...form.querySelectorAll('select')
   ].forEach(element => {
      if (element instanceof HTMLInputElement) element.value = ''
      else if (element instanceof HTMLSelectElement) element.selectedIndex = 0
      element.classList.remove('is-valid', 'is-invalid')
   })
}

export function goToElement(element?: HTMLElement) {
   if (element && document.contains(element)) {
      console.log('Going to element:', element);
      // Get element's position and dimensions for the overlay
      const rect = element.getBoundingClientRect();

      // Create the overlay element
      const overlay = document.createElement('div');
      overlay.classList.add('overlay');

      // Set the overlay's position relative to the target element
      overlay.style.position = 'absolute';
      overlay.style.width = `${rect.width}px`;
      overlay.style.height = `${rect.height}px`;

      // Append overlay to the target element's container (its parent)
      element.style.position = 'relative'; // Ensure target element is positioned relative
      element.appendChild(overlay);

      // Scroll smoothly to the element
      window.scrollTo({
         top: element.offsetTop,
         behavior: 'smooth',
      });

      // Remove the overlay after the animation ends (1 second)
      setTimeout(() => {
         overlay.remove();
      }, 1000); // This matches the animation duration
   }
}

export function normalizeDate(date: Date) {
   return `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}-${date.getFullYear()}`
}
