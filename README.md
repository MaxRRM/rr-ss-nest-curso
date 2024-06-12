# Taller NestJS Backend

Proyecto aplica CRUD para Usuarios, Proveedores y Productos. Los endpoints de Proveedores y Productos se encuentran protegidos para usuarios logueados y requieren autorización JWT.

## Installation

Use el package manager NPM para instalar las dependencias.

```bash
npm install
```

## Usage

Asigne la *uri* de su base de datos mongoDB y el secreto para la encriptación del token en el archivo de entorno *.env* que se encuentra en la raíz del proyecto.

```javascript
JWT_SECRET = your_secret_string
MONGO_URI = mongodb://your-host/your_db_name

```

Para correr el proyecto ejecute:
```bash
npm run start
```