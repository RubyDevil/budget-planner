import { Budget } from "../budget"
import { create } from "../utils"

export interface EntryJson {
   uuid: string
}

export abstract class Entry {
   budget: Budget
   uuid: string
   row: HTMLTableRowElement

   constructor(budget: Budget, data: EntryJson) {
      this.budget = budget
      this.uuid = data.uuid
      this.row = create('tr', { id: this.uuid })
   }


   abstract createLink(): HTMLAnchorElement
   static unknownLink(): HTMLAnchorElement {
      return create('a', { class: 'text-danger' }, 'Unknown')
   }

   abstract build(editMode?: boolean): HTMLTableRowElement
   abstract edit(): void
   abstract delete(): void
   abstract save(): void
   abstract toJson(): EntryJson
}
