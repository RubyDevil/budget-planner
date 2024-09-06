export class API {
   static ROUTE = {
      DATA: "/api/data",
   }

   static async post(route, data) {
      const response = await fetch(route, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(data),
      })

      return response.json()
   }

   static async get(route) {
      const response = await fetch(route)
      return response.json()
   }
}
