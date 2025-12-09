import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import User from "../model/UserModel"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { registerSchema } from "../validators/authValidator" //
dotenv.config()

//  LÍNEA ELIMINADA: Ya no se define SECRET_KEY globalmente aquí

class AuthController {
  // http://localhost:3000/auth/register
  // method: POST
  // body: {"email": "gabi@gmail.com", "password": pepe123}
  static register = async (req: Request, res: Response): Promise<void | Response> => {
    try {
        // 1. VALIDACIÓN CON ZOD: Usa el esquema para validar el cuerpo de la solicitud
        const validator = registerSchema.safeParse(req.body);

        if (!validator.success) {
            // Si falla (ej: email mal formado, password corta), devuelve 400 con el error detallado
            return res.status(400).json({ success: false, error: validator.error.flatten().fieldErrors });
        }

        // 2 EXTRAER DATOS VALIDADOS
        const { email, password } = validator.data;

        // 3 VERIFICACIÓN DE USUARIO EXISTENTE (Lógica original)
        const user = await User.findOne({ email });

        if (user) {
            return res.status(409).json({ success: false, error: "El usuario ya existe en la base de datos." });
        }

        // 4. CREAR HASH Y GUARDAR
        const hash = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hash });

        await newUser.save();
        res.status(201).json({ success: true, data: newUser });

    } catch (e) {
        const error = e as Error;
        switch (error.name) {
            case "MongoServerError":
                return res.status(409).json({ success: false, error: "Usuario ya existente en nuestra base de datos" });
        }
        // Aseguramos que cualquier otro error 500 se maneje correctamente
        return res.status(500).json({ success: false, error: error.message });
    }
}
  static login = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({ success: false, error: "Datos invalidos" })
      }

      const user = await User.findOne({ email })

      if (!user) {
        return res.status(401).json({ success: false, error: "No autorizado" })
      }

      // validar la contraseña
      const isValid = await bcrypt.compare(password, user.password)

      if (!isValid) {
        return res.status(401).json({ success: false, error: "No autorizado" })
      }

      //  CAMBIO CLAVE:  process.env.JWT_SECRET directamente aquí.
      const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: "1h" })
      res.json({ success: true, token })
    } catch (e) {
      const error = e as Error
      res.status(500).json({ success: false, error: error.message })
    }
  }
}

export default AuthController