const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');
db.serialize(() => {
    db.run("ALTER TABLE orders ADD COLUMN user_id INTEGER;", (err) => console.log(err ? err.message : 'user_id added'));
    db.run("ALTER TABLE orders ADD COLUMN payment_status TEXT DEFAULT 'Pendiente';", (err) => console.log(err ? err.message : 'payment_status added'));
    db.run("ALTER TABLE orders ADD COLUMN driver_name TEXT;", (err) => console.log(err ? err.message : 'driver_name added'));
    db.run("ALTER TABLE orders ADD COLUMN items TEXT;", (err) => console.log(err ? err.message : 'items added'));
});
