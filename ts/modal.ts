import { create } from "./utils"

export abstract class Modal {
   static root: HTMLDivElement = document.body.appendChild(create('div', { class: 'modal fade', tabindex: -1, 'data-bs-backdrop': 'static', 'data-bs-keyboard': 'false' }))
   static dialog: HTMLDivElement = this.root.appendChild(create('div', { class: 'modal-dialog modal-dialog-centered modal-dialog-scrollable' }))
   static content: HTMLDivElement = this.dialog.appendChild(create('div', { class: 'modal-content' }))
   static header: HTMLDivElement = this.content.appendChild(create('div', { class: 'modal-header' }))
   static body: HTMLDivElement = this.content.appendChild(create('div', { class: 'modal-body container-fluid' }))
   static footer: HTMLDivElement = this.content.appendChild(create('div', { class: 'modal-footer' }))
   static title: HTMLHeadingElement = this.header.appendChild(create('h5', { class: 'modal-title' }))
   static #closeButton: HTMLButtonElement = this.header.appendChild(create('button', { type: 'button', class: 'btn-close', 'data-bs-dismiss': 'modal', 'aria-label': 'Close' })) /* @ts-ignore */
   static #bsInstance: bootstrap.Modal = new bootstrap.Modal(this.root)

   static rebuild(title: string, dismissable: boolean, callback?: () => any) {
      this.root = document.body.appendChild(create('div', { class: 'modal fade', tabindex: -1, 'data-bs-backdrop': dismissable || 'static', 'data-bs-keyboard': dismissable }))
      this.dialog = this.root.appendChild(create('div', { class: 'modal-dialog modal-dialog-centered modal-dialog-scrollable' }))
      this.content = this.dialog.appendChild(create('div', { class: 'modal-content' }))
      this.header = this.content.appendChild(create('div', { class: 'modal-header' }))
      this.body = this.content.appendChild(create('div', { class: 'modal-body container-fluid' }))
      this.footer = this.content.appendChild(create('div', { class: 'modal-footer' }))
      this.title = this.header.appendChild(create('h5', { class: 'modal-title' }, title))
      this.#closeButton = this.header.appendChild(create('button', { type: 'button', class: 'btn-close', 'data-bs-dismiss': 'modal', 'aria-label': 'Close' }))
      if (!dismissable) this.#closeButton.remove()
      this.#bsInstance.dispose() /* @ts-ignore */
      this.#bsInstance = new bootstrap.Modal(this.root)
      this.root.addEventListener('hidden.bs.modal', () => callback?.())
   }

   static show() { this.#bsInstance.show() }
   static hide() { this.#bsInstance.hide() }
   static toggle() { this.#bsInstance.toggle() }
}