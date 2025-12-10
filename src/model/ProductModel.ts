// DEFINE EL ESQUEMA DE DATOS Y CREA EL MODELO
// EL MODELO:
// 1 - crea la colección en mongodb
// 2 - habilita los métodos de manipulación de data

// En src/model/ProductModel.ts
// DEFINE EL ESQUEMA DE DATOS Y CREA EL MODELO


import { model, Model, Schema, SchemaDefinitionProperty, Types } from "mongoose" 

import IProduct from "../interfaces/IProduct"

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, default: "No tiene descripción" },
  stock: { type: Number, default: 0, min: 0 },
  category: { type: String, default: "No tiene categoria" },
  price: { type: Number, default: 0, min: 0 },
  image: { type: String },
    
  //  Usamos Schema.Types.ObjectId, que es el tipo que espera el validador de TypeScript/Mongoose
  owner: {
    type: Schema.Types.ObjectId, 
    ref: 'User',                 
    required: true               // Todo producto nuevo debe tener un dueño
  }
}, {
  versionKey: false
})

const Product: Model<IProduct> = model("Product", productSchema)

export default Product