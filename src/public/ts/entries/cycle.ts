export enum CYCLE {
   DAY = 'day',
   WEEK = 'week',
   MONTH = 'month',
   YEAR = 'year'
}

export const CYCLE_DAYS: {
   [key in CYCLE]: number
} = {
   [CYCLE.DAY]: 1,
   [CYCLE.WEEK]: 7,
   [CYCLE.MONTH]: 30,
   [CYCLE.YEAR]: 365
}

export function isCycle(value: any): value is CYCLE {
   return Object.values(CYCLE).includes(value)
}
