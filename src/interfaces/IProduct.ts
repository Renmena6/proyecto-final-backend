// En src/interfaces/IProduct.ts

import { Types } from "mongoose" 

interface IProduct {
  name: string,
  description: string,
  stock: number,
  category: string
  price: number,
  image?: string,
  owner: Types.ObjectId // ⬅️ ¡CORRECCIÓN! Propiedad Dueño
}

export default IProduct