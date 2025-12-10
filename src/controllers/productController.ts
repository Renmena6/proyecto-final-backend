
// FUNCIONES QUE SANITIZAN DATOS DE ENTRADA Y RESPONDEN AL CLIENTE

import { Request, Response } from "express"
import Product from "../model/ProductModel"
import { Types } from "mongoose"
import { createProductSchema, updatedProductSchema } from "../validators/productValidator"

class ProductController {
  static getAllProducts = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const { name, stock, category, minPrice, maxPrice } = req.query
      
      const filter: Record<string, any> = {}

      if (name) filter.name = new RegExp(String(name), "i")
      if (category) filter.category = new RegExp(String(category), "i")
      
      if (stock) filter.stock = Number(stock)
      
      if (minPrice || maxPrice) {
        const numericMinPrice = minPrice ? Number(minPrice) : undefined;
        const numericMaxPrice = maxPrice ? Number(maxPrice) : undefined;

        filter.price = {}
        
        if (numericMinPrice !== undefined) filter.price.$gte = numericMinPrice
        if (numericMaxPrice !== undefined) filter.price.$lte = numericMaxPrice
      }

      const products = await Product.find(filter)
      res.json({ success: true, data: products })
    } catch (e) {
      const error = e as Error
      res.status(500).json({ success: false, error: error.message })
    }
  }

  static getProduct = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const { id } = req.params

      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: "ID Inválido" })
      }

      const product = await Product.findById(id)

      if (!product) {
        return res.status(404).json({ success: false, error: "Producto no encontrado" })
      }

      res.status(200).json({ success: true, data: product })
    } catch (e) {
      const error = e as Error
      res.status(500).json({ success: false, error: error.message })
    }
  }

  static addProduct = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const { body, file } = req
      
      //  Obtención del ID del usuario logueado (necesario para el owner)
      const userId = (req as any).user.id; 

      const { name, description, price, category, stock } = body

      const dataToValidate = {
        name,
        description,
        category,
        stock: +stock,
        price: +price,
        image: file?.path
      }

      const validator = createProductSchema.safeParse(dataToValidate)

      if (!validator.success) {
        return res.status(400).json({ success: false, error: validator.error.flatten().fieldErrors });
      }

      const newProduct = new Product({
          ...validator.data,
          owner: userId //  ASIGNAMOS EL DUEÑO
      })

      await newProduct.save()
      res.status(201).json({ success: true, data: newProduct })
    } catch (e) {
      const error = e as Error
      res.status(500).json({ success: false, error: error.message })
    }
  }

  static updateProduct = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const { id } = req.params
      const { body } = req
      const userId = (req as any).user.id; // ID del usuario logueado

      if (!Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, error: "ID Inválido" })

      // 1 ENCUENTRA EL PRODUCTO
      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({ success: false, error: "Producto no encontrado" })
      }
      
      //  VERIFICACIÓN DE PROPIEDAD: Si el owner NO es el usuario logueado 
      if (product.owner.toString() !== userId) {
          // 
          return res.status(403).json({ success: false, error: "No tienes permiso para editar este producto" }); 
      }
      
      // 3. CONTINUAR CON LA ACTUALIZACIÓN...
      const dataToValidate = {
        ...body,
        ...(body.price && { price: +body.price }),
        ...(body.stock && { stock: +body.stock }),
      };

      const validator = updatedProductSchema.safeParse(dataToValidate)

      if (!validator.success) {
        return res.status(400).json({ success: false, error: validator.error.flatten().fieldErrors });
      }

      const updatedProduct = await Product.findByIdAndUpdate(id, validator.data, { new: true })

      res.json({ success: true, data: updatedProduct })
    } catch (e) {
      const error = e as Error
      res.status(500).json({ success: false, error: error.message })
    }
  }

  static deleteProduct = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const id = req.params.id
      const userId = (req as any).user.id; // ID del usuario logueado

      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: "ID Inválido" });
      }

      // 1. ENCUENTRA EL PRODUCTO
      const product = await Product.findById(id);
      
      if (!product) {
        return res.status(404).json({ success: false, error: "Producto no encontrado" })
      }
      
      // 🚀 VERIFICACIÓN DE PROPIEDA Si el owner NO es el usuario logueado 
      if (product.owner.toString() !== userId) {
          return res.status(403).json({ success: false, error: "No tienes permiso para eliminar este producto" }); // 403 Forbidden
      }
      
      // 3. SI PASA LA VERIFICACIÓN, PROCEDER A BORRAR
      const deletedProduct = await Product.findByIdAndDelete(id) 

      res.json({ success: true, data: deletedProduct })
    } catch (e) {
      const error = e as Error
      res.status(500).json({ success: false, error: error.message }) 
    }
  }
}

export default ProductController