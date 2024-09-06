export function create<T extends keyof HTMLElementTagNameMap>(tagName: T, attributes?: object, content?: string | HTMLElement[]): HTMLElementTagNameMap[T] {
   const element = document.createElement(tagName)
   if (attributes)
      for (const key in attributes)
         element.setAttribute(key, attributes[key])
   if (content)
      if (typeof content === 'string') element.textContent = content
      else for (const child of content) element.appendChild(child)
   return element
}

export const Buttons = {
   Edit() {
      const btn = create('button', { class: 'btn btn-outline-secondary' })
      btn.appendChild(create('i', { class: 'bi bi-pencil-fill' }))
      return btn
   },
   Save() {
      const btn = create('button', { class: 'btn btn-outline-success' })
      btn.appendChild(create('i', { class: 'bi bi-check-lg' }))
      return btn
   },
   Delete() {
      const btn = create('button', { class: 'btn btn-outline-danger' })
      btn.appendChild(create('i', { class: 'bi bi-trash-fill' }))
      return btn
   },
   Cancel() {
      const btn = create('button', { class: 'btn btn-outline-warning' })
      btn.appendChild(create('i', { class: 'bi bi-x-lg' }))
      return btn
   },
   Add() {
      const btn = create('button', { class: 'btn btn-outline-primary' })
      btn.appendChild(create('i', { class: 'bi bi-plus-lg' }))
      return btn
   }
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
   if (element) {
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
