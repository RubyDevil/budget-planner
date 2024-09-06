import { Budget } from "../budget"
import { create } from "../utils"

export abstract class Entry {
   budget: Budget
   uuid: string
   row: HTMLTableRowElement

   constructor(budget: Budget, uuid: string) {
      this.budget = budget
      this.uuid = uuid
      this.row = create('tr', { id: uuid })
   }

   abstract build(editMode?: boolean): HTMLTableRowElement
   abstract edit(): void
   abstract delete(): void
   abstract save(): void
}
