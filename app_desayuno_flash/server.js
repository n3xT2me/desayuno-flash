const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3005;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'premium_flash_secret',
    resave: false,
    saveUninitialized: true
}));

// Middleware para pasar usuario a las vistas
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    if (!req.session.cart) req.session.cart = [];
    res.locals.cart = req.session.cart;
    next();
});

// RUTAS PÚBLICAS

// --- CARRITO ---
app.post('/cart/add', (req, res) => {
    const { product_id, name, price, image_url, restaurant_id } = req.body;
    req.session.cart.push({ product_id, name, price: parseFloat(price), image_url, restaurant_id });
    res.redirect(req.get('Referrer') || '/restaurantes');
});

app.get('/cart', (req, res) => {
    res.render('cart', { cart: req.session.cart });
});

app.post('/cart/clear', (req, res) => {
    req.session.cart = [];
    res.redirect('/cart');
});

// --- MIS PEDIDOS Y SEGUIMIENTO ---
app.get('/mis-pedidos', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    db.all("SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC", [req.session.user.id], (err, orders) => {
        res.render('mis-pedidos', { orders: orders || [] });
    });
});

app.get('/seguimiento/:id', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    db.get("SELECT * FROM orders WHERE id = ? AND user_id = ?", [req.params.id, req.session.user.id], (err, order) => {
        if (!order) return res.redirect('/mis-pedidos');
        res.render('tracking', { order });
    });
});

app.get('/api/pedido/:id', (req, res) => {
    db.get("SELECT status, payment_status, driver_name FROM orders WHERE id = ?", [req.params.id], (err, order) => {
        if (order) res.json(order);
        else res.status(404).json({ error: 'Not found' });
    });
});

app.post('/repetir-pedido/:id', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    db.get("SELECT items FROM orders WHERE id = ?", [req.params.id], (err, order) => {
        if (order && order.items) {
            req.session.cart = JSON.parse(order.items);
            res.redirect('/cart');
        } else {
            res.redirect('/mis-pedidos');
        }
    });
});

app.get('/', (req, res) => res.render('index'));
app.get('/membresias', (req, res) => res.render('membresias'));

app.get('/restaurantes', (req, res) => {
    db.all("SELECT * FROM restaurants", [], (err, rows) => {
        res.render('catalog', { restaurants: rows });
    });
});

app.get('/restaurante/:id', (req, res) => {
    db.get("SELECT * FROM restaurants WHERE id = ?", [req.params.id], (err, restaurant) => {
        db.all("SELECT * FROM products WHERE restaurant_id = ?", [req.params.id], (err, products) => {
            res.render('restaurant', { restaurant, products });
        });
    });
});

app.get('/checkout', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    if (req.session.cart.length === 0) return res.redirect('/restaurantes');
    const total = req.session.cart.reduce((sum, item) => sum + item.price, 0);
    res.render('checkout', { total });
});

app.post('/procesar-pedido', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const { customer_name, customer_phone, delivery_address, scheduled_time } = req.body;
    const total_price = req.session.cart.reduce((sum, item) => sum + item.price, 0);
    const items = JSON.stringify(req.session.cart);
    
    db.run(`INSERT INTO orders (user_id, customer_name, customer_phone, delivery_address, scheduled_time, total_price, status, payment_status, items) VALUES (?, ?, ?, ?, ?, ?, 'Pendiente', 'Pendiente', ?)`, 
    [req.session.user.id, customer_name, customer_phone, delivery_address, scheduled_time, total_price, items], function(err) {
        req.session.cart = [];
        res.render('success', { orderId: this.lastID, scheduled_time, customer_name });
    });
});

app.get('/checkout-membresia/:tipo', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const tipo = req.params.tipo;
    const plan = tipo === 'estudiante' ? { name: 'Plan Estudiante', price: 49.00 } : { name: 'Plan Ejecutivo Fit', price: 89.00 };
    res.render('checkout-membresia', { plan });
});

app.post('/procesar-membresia', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const { membership_type } = req.body;
    db.run("UPDATE users SET membership_type = ?, membership_status = 'Pendiente Validación' WHERE id = ?", [membership_type, req.session.user.id], () => {
        // Actualizar sesión
        req.session.user.membership_type = membership_type;
        req.session.user.membership_status = 'Pendiente Validación';
        res.send("<script>alert('Membresía solicitada. Transfiere por Yape y el Admin te activará pronto.'); window.location.href='/membresias';</script>");
    });
});

// AUTENTICACIÓN Y USUARIOS
app.get('/login', (req, res) => res.render('login', { error: null }));
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.get("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (err, user) => {
        if (user) {
            req.session.user = user;
            if (user.role === 'admin') return res.redirect('/admin');
            return res.redirect('/restaurantes');
        }
        res.render('login', { error: 'Credenciales incorrectas' });
    });
});

app.get('/register', (req, res) => res.render('register'));
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    db.run("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')", [name, email, password], err => {
        if (err) return res.render('login', { error: 'El correo ya existe' });
        res.redirect('/login');
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// PANEL DE ADMINISTRADOR
app.get('/admin', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') return res.redirect('/login');
    
    db.all("SELECT * FROM orders ORDER BY id DESC", (err, orders) => {
        db.get("SELECT SUM(total_price) as total_ventas, COUNT(id) as total_pedidos FROM orders", (err, stats) => {
            db.all("SELECT * FROM products", (err, products) => {
                db.all("SELECT * FROM users", (err, users) => {
                    db.all("SELECT * FROM drivers", (err, drivers) => {
                        db.all("SELECT * FROM restaurants", (err, restaurants) => {
                            const total_entregados = orders.filter(o => o.status === 'Entregado').length;
                            const total_en_ruta = orders.filter(o => o.status === 'En Ruta').length;
                            const total_preparando = orders.filter(o => o.status === 'Programado').length;
                            res.render('admin', { 
                                orders, 
                                stats: stats || { total_ventas: 0, total_pedidos: 0 },
                                products: products || [],
                                users: users || [],
                                drivers: drivers || [],
                                restaurants: restaurants || [],
                                totales: { entregados: total_entregados, en_ruta: total_en_ruta, preparando: total_preparando }
                            });
                        });
                    });
                });
            });
        });
    });
});

app.post('/admin/pedido/:id/estado', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') return res.status(403).send("No autorizado");
    db.run("UPDATE orders SET status = ? WHERE id = ?", [req.body.status, req.params.id], () => {
        res.redirect('/admin');
    });
});

app.post('/admin/pedido/:id/pago', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') return res.status(403).send("No autorizado");
    db.run("UPDATE orders SET payment_status = ? WHERE id = ?", [req.body.payment_status, req.params.id], () => {
        res.redirect('/admin');
    });
});

app.post('/admin/pedido/:id/asignar-repartidor', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') return res.status(403).send("No autorizado");
    db.run("UPDATE orders SET driver_name = ? WHERE id = ?", [req.body.driver_name, req.params.id], () => {
        res.redirect('/admin');
    });
});

app.post('/admin/usuario/:id/eliminar', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') return res.status(403).send("No autorizado");
    db.run("DELETE FROM users WHERE id = ? AND role != 'admin'", [req.params.id], () => {
        res.redirect('/admin');
    });
});

app.post('/admin/membresia/:id/actualizar', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') return res.status(403).send("No autorizado");
    db.run("UPDATE users SET membership_type = ?, membership_status = ? WHERE id = ?", [req.body.membership_type, req.body.membership_status, req.params.id], () => {
        res.redirect('/admin');
    });
});


app.post('/admin/pedido/:id/actualizar-todo', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') return res.status(403).send("No autorizado");
    const { status, payment_status, driver_name } = req.body;
    db.run("UPDATE orders SET status = ?, payment_status = ?, driver_name = ? WHERE id = ?", 
        [status, payment_status, driver_name, req.params.id], () => {
        res.redirect('/admin');
    });
});

app.listen(PORT, () => {
    console.log(`Servidor de Desayuno Flash corriendo en puerto ${PORT}`);
});
