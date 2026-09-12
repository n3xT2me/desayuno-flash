# Desayuno Flash - Proyecto Emprendimiento

Plataforma integral para programar desayunos saludables la noche anterior, con entrega rápida y puntual por la mañana.

##  Estructura del Repositorio

- **`app_desayuno_flash/`**: Aplicación web completa (Backend Node.js/Express, Frontend EJS + Tailwind CSS, Base de Datos SQLite, Carrito, Autenticación y Panel Administrativo).
- **`web_desayuno_flash/`**: Landing page estática de presentación para clientes.
- **`Imagenes de los Fundadores/`**: Fotografías del equipo emprendedor.
- **`QR DE PAGO/`**: Códigos QR para el flujo de pago con billeteras digitales (Yape/Plin).

---

##  ¿Cómo ejecutar la aplicación web en local o en tu propio host?

### 1. Requisitos
- [Node.js](https://nodejs.org/) (versión 16 o superior).

### 2. Instalación
Ingresa a la carpeta de la aplicación e instala las dependencias:

```bash
cd app_desayuno_flash
npm install
```

### 3. Iniciar el servidor
```bash
npm start
```

El servidor se iniciará automáticamente en:
`http://localhost:3005` (o en el puerto definido por la variable de entorno `PORT`).

---

##  Cuentas de Acceso

- **Administrador:**
  - **Email:** `admin@desayunoflash.com`
  - **Contraseña:** `admin123`
  - Permite gestionar pedidos, cambiar estados de entrega, asignar repartidores y ver métricas financieras en tiempo real.

- **Cliente:**
  - Puedes crear una cuenta nueva desde `/register` o hacer pedidos directamente indicando tu dirección y WhatsApp.
