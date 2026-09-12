# Proyecto: Desayuno Flash Saludable

## Descripción
MVP (Producto Mínimo Viable) para el emprendimiento "Desayuno Flash Saludable". Es una plataforma web diseñada como SaaS (Software as a Service) que permite a estudiantes y oficinistas programar sus desayunos saludables la noche anterior, asegurando una entrega rápida y eficiente por la mañana.

## Tecnologías Utilizadas
- **Backend:** Node.js, Express.js
- **Base de Datos:** SQLite (Base de datos local `database.sqlite` - No requiere servidor externo)
- **Frontend:** EJS (Motor de plantillas), Tailwind CSS (Cargado vía CDN)
- **Sesiones:** express-session

## ¿Cómo Desplegar el Proyecto?
Este proyecto es 100% portable. La base de datos y todas las imágenes locales están incluidas en la carpeta. Para ponerlo a funcionar en cualquier computadora o host (como Render, Heroku o un VPS), solo debes seguir 3 pasos:

### 1. Requisitos Previos
Tener instalado **Node.js** (versión 16 o superior).

### 2. Instalación de Dependencias
Abre la terminal en la carpeta raíz de este proyecto y ejecuta:
```bash
npm install
```

### 3. Iniciar el Servidor
```bash
node server.js
```
El servidor se iniciará en el puerto 3005. Podrás ver la aplicación ingresando a:
`http://localhost:3005`

---

## Cuentas de Prueba
- **Rol Administrador:**
  - Correo: `admin@desayunoflash.com`
  - Contraseña: `admin123`
  - *Te permite acceder al panel de control, ver métricas financieras en tiempo real y gestionar estados de los pedidos.*

- **Usuario Normal:**
  - Puedes crear una cuenta nueva desde la vista `/login` o hacer checkout directamente sin cuenta, donde se pedirán tus datos de entrega y WhatsApp.

## Características Clave del MVP
1. **Application Shell (Dashboard UI):** Diseño responsivo a pantalla completa.
2. **Pasarela Billetera Digital (Simulada):** Flujo de pago adaptado al mercado peruano (Yape/Plin) con QR y confirmación.
3. **Membresías:** Vistas de planes de suscripción para ingresos recurrentes.
4. **Catálogo Dinámico:** Platos e imágenes cargados 100% desde la base de datos `database.sqlite`.

---
*Desarrollado para presentación de proyecto de emprendimiento.*
