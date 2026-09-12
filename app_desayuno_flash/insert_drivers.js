const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS drivers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT
    )`);
    
    // Check if they exist to prevent duplicates
    db.get("SELECT COUNT(*) as count FROM drivers", (err, row) => {
        if (row && row.count === 0) {
            db.run("INSERT INTO drivers (name) VALUES ('Cesar Acuña')");
            db.run("INSERT INTO drivers (name) VALUES ('Keiko Fujimori')");
            console.log("Repartidores insertados correctamente.");
        } else {
            console.log("La tabla ya tiene datos. Insertando si no existen...");
            db.run("INSERT INTO drivers (name) SELECT 'Cesar Acuña' WHERE NOT EXISTS(SELECT 1 FROM drivers WHERE name='Cesar Acuña')");
            db.run("INSERT INTO drivers (name) SELECT 'Keiko Fujimori' WHERE NOT EXISTS(SELECT 1 FROM drivers WHERE name='Keiko Fujimori')");
            console.log("Repartidores asegurados.");
        }
    });
});
