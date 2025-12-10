
# Trabajo Final: API REST para Gestión de Productos (Backend)

Este proyecto representa el desarrollo completo del Backend para un sistema de gestión de productos, construido como una API RESTful robusta, utilizando TypeScript.

Mi enfoque principal fue asegurar una arquitectura limpia (MVC) y garantizar la máxima seguridad y robustez, cumpliendo con todos los requisitos del trabajo práctico. Esta API está diseñada para ser el motor de datos del Frontend proporcionado.

## ✨ Características y Stack Tecnológico

La API se basa en las siguientes tecnologías y principios de diseño:

| Categoría | Tecnología | Notas de Implementación |
| :--- | :--- | :--- |
| **Lenguaje** | **TypeScript** | Todo el código está fuertamente tipado para evitar errores en tiempo de ejecución. |
| **Arquitectura** | **MVC** | Separación clara de Modelos, Controladores, Rutas y Servicios. |
| **Base de Datos** | **MongoDB / Mongoose** | Utilizado para la persistencia de datos. |
| **Seguridad** | **JWT / Bcrypt** | Autenticación basada en tokens y *hashing* de contraseñas. |
| **Autorización** | **Lógica de Propiedad** | Implementada para asegurar que solo el dueño (`owner`) pueda modificar o eliminar sus propios productos. |
| **Validación** | **Zod** | Uso de Zod para validar rigurosamente todos los datos de entrada del cliente. |
| **Monitorización** | **Morgan Logger** | Implementado para registrar todas las solicitudes HTTP (`método`, `ruta`, `status code`). |
| **Protección** | **Rate Limiting** | Aplicado a las rutas de autenticación (`/auth`) para prevenir ataques de fuerza bruta. |
| **Despliegue** | **Render.com** | API desplegada en producción y lista para ser consumida. |

## 🛠️ Instalación y Configuración Local

Sigue estos pasos para poner en marcha el servidor en tu máquina:

### 1. Clonar el Repositorio

```bash
git clone [https://docs.github.com/es/repositories/creating-and-managing-repositories/quickstart-for-repositories](https://docs.github.com/es/repositories/creating-and-managing-repositories/quickstart-for-repositories)
cd [nombre-de-tu-proyecto]
````

### 2\. Instalar Dependencias

```bash
npm install
```

### 3\. Configurar el Entorno

Crea un archivo llamado **`.env`** en la raíz del proyecto. Este archivo contiene las variables sensibles.

-----

## 🔑 Variables de Entorno (`.env.example`)

Este es un ejemplo de las variables que se deben configurar en el archivo `.env`:

```bash
# Puerto del servidor
PORT=4000

# Cadena de conexión a MongoDB Atlas
URI_DB="mongodb+srv://<usuario>:<password>@cluster0.x9l1yah.mongodb.net/proyecto-final?appName=Cluster0"

# Secreto para firmar y verificar los JSON Web Tokens (DEBE SER FUERTE)
JWT_SECRET="MiClaveSecretaUnica" 

# Variables para Nodemailer (Opcional)
EMAIL_SERVICE_HOST=smtp.gmail.com
EMAIL_SERVICE_PORT=465
EMAIL_USER=tu_correo@gmail.com 
EMAIL_PASS=tu_password_app
```

-----

## 🏃 Comandos de Ejecución

Para iniciar el servidor en diferentes entornos:

| Script | Uso | Descripción |
| :--- | :--- | :--- |
| **`npm run dev`** | `ts-node-dev src/server.ts` | Inicia el servidor en modo desarrollo con recarga automática. |
| **`npm run build`** | `tsc` | Compila el código TypeScript a JavaScript de producción (`dist/`). |
| **`npm run start`** | `node dist/server.js` | Inicia el servidor usando el código JavaScript compilado (Producción). |

-----

## 🌎 Endpoints de la API y Seguridad

Todos los *endpoints* son consumibles desde la URL de Render.

| Método | Ruta | Descripción | Seguridad Requerida |
| :--- | :--- | :--- | :--- |
| **POST** | `/auth/register` | Crea un nuevo usuario. | Pública (con Rate Limit) |
| **POST** | `/auth/login` | Autenticación y obtención del token JWT. | Pública (con Rate Limit) |
| **GET** | `/products` | Lista todos los productos. | Pública |
| **GET** | `/products/:id` | Busca un producto específico por ID. | Pública |
| **POST** | `/products` | **Crea un nuevo producto.** | **Auth Token (Usuario Logueado)** |
| **PATCH** | `/products/:id` | **Edita un producto.** | **Auth Token + Debe ser el DUEÑO del producto** |
| **DELETE** | `/products/:id` | **Elimina un producto.** | **Auth Token + Debe ser el DUEÑO del producto** |

### 🔍 Filtrado Dinámico de Productos

El *endpoint* de listado (`GET /products`) soporta filtrado dinámico a través de *Query Parameters*. La lógica se maneja directamente en la consulta de Mongoose para optimizar el rendimiento:

| Parámetro | Ejemplo | Función |
| :--- | :--- | :--- |
| `name` | `?name=zapatilla` | Búsqueda parcial e insensible a mayúsculas/minúsculas. |
| `category` | `?category=deporte` | Filtrado exacto por categoría. |
| `stock` | `?stock=10` | Búsqueda por cantidad exacta en stock. |
| `minPrice` | `?minPrice=50` | Filtra productos con un precio **igual o mayor** al valor. |
| `maxPrice` | `?maxPrice=200` | Filtra productos con un precio **igual o menor** al valor. |

```
```