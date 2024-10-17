import { create } from "./utils"

export class Modal {
   #bsInstance: bootstrap.Modal
   root: HTMLDivElement
   dialog: HTMLDivElement
   content: HTMLDivElement
   header: HTMLDivElement
   body: HTMLDivElement
   footer: HTMLDivElement
   title: HTMLHeadingElement
   #closeButton: HTMLButtonElement

   constructor(title: string, dismissable: boolean, ephemeral: boolean = true) {
      this.root = document.body.appendChild(create('div', { class: 'modal fade', tabindex: -1, 'data-bs-backdrop': dismissable || 'static', 'data-bs-keyboard': dismissable }))
      this.dialog = this.root.appendChild(create('div', { class: 'modal-dialog modal-dialog-centered modal-dialog-scrollable' }))
      this.content = this.dialog.appendChild(create('div', { class: 'modal-content' }))
      this.header = this.content.appendChild(create('div', { class: 'modal-header' }))
      this.body = this.content.appendChild(create('div', { class: 'modal-body container-fluid' }))
      this.footer = this.content.appendChild(create('div', { class: 'modal-footer' }))
      this.title = this.header.appendChild(create('h5', { class: 'modal-title' }, title))
      this.#closeButton = this.header.appendChild(create('button', { type: 'button', class: 'btn-close', 'data-bs-dismiss': 'modal', 'aria-label': 'Close' }))
      if (!dismissable) this.#closeButton.remove()
      /* @ts-ignore */
      this.#bsInstance = new bootstrap.Modal(this.root)
      if (ephemeral) this.root.addEventListener('hidden.bs.modal', () => this.destroy())
   }

   show() { this.#bsInstance.show() }
   hide() { this.#bsInstance.hide() }
   toggle() { this.#bsInstance.toggle() }

   destroy() {
      this.#bsInstance.dispose()
      this.root.remove()
   }
}