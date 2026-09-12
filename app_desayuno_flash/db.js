const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Crea o conecta a la base de datos (un archivo físico que puedes compartir)
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar a la base de datos', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
    }
});

// Inicializar Tablas
db.serialize(() => {
    // Tabla Restaurantes
    db.run(`CREATE TABLE IF NOT EXISTS restaurants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        tags TEXT
    )`);

    // Tabla Productos (Menús)
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        restaurant_id INTEGER,
        name TEXT NOT NULL,
        description TEXT,
        price REAL,
        calories INTEGER,
        image_url TEXT,
        FOREIGN KEY(restaurant_id) REFERENCES restaurants(id)
    )`);

    // Tabla Pedidos (Órdenes Programadas)
    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        customer_name TEXT,
        customer_phone TEXT,
        delivery_address TEXT,
        scheduled_time TEXT,
        total_price REAL,
        status TEXT DEFAULT 'Pendiente',
        payment_status TEXT DEFAULT 'Pendiente',
        driver_name TEXT,
        items TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Insertar datos de prueba (Restaurantes) solo si está vacía
    db.get("SELECT COUNT(*) as count FROM restaurants", (err, row) => {
        if (row && row.count === 0) {
            console.log("Insertando datos de prueba...");
            
            const insertRest = db.prepare("INSERT INTO restaurants (name, description, image_url, tags) VALUES (?, ?, ?, ?)");
            insertRest.run('FitLife Chiclayo', 'Desayunos altos en proteína y bajos en carbohidratos.', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500', 'Proteico, Keto');
            insertRest.run('Natura Bowl', 'Especialistas en bowls de avena, frutas y superalimentos.', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500', 'Vegano, Frutas');
            insertRest.run('Green Start', 'Sándwiches integrales y jugos detox para empezar el día.', 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500', 'Detox, Integral');
            insertRest.finalize();

            // Insertar Productos
            setTimeout(() => {
                const insertProd = db.prepare("INSERT INTO products (restaurant_id, name, description, price, calories, image_url) VALUES (?, ?, ?, ?, ?, ?)");
                // FitLife
                insertProd.run(1, 'Pancakes Proteicos', 'Pancakes de avena y proteína whey con arándanos.', 15.00, 350, 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500');
                insertProd.run(1, 'Huevos Revueltos Fit', '3 claras, 1 yema, espinaca y pan integral.', 12.00, 250, 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500');
                
                // Natura Bowl
                insertProd.run(2, 'Acai Bowl', 'Bowl de Acai con plátano, fresas y chía.', 18.00, 300, 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=500');
                insertProd.run(2, 'Avena Trasnochada', 'Avena reposada en leche de almendras con frutos rojos.', 10.00, 200, 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=500');
                
                insertProd.finalize();
            }, 1000); // Esperar un segundo para asegurar que los restaurantes existan
        }
    });
});

module.exports = db;
