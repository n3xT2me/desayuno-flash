const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

// Initialize cart in middleware
const middlewarePatch = `
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    if (!req.session.cart) req.session.cart = [];
    res.locals.cart = req.session.cart;
    next();
});
`;
code = code.replace(/app\.use\(\(req, res, next\) => \{[\s\S]*?next\(\);\n\}\);/, middlewarePatch.trim());

// Add cart routes and user orders
const newRoutes = `

// --- CARRITO ---
app.post('/cart/add', (req, res) => {
    const { product_id, name, price, image_url, restaurant_id } = req.body;
    req.session.cart.push({ product_id, name, price: parseFloat(price), image_url, restaurant_id });
    res.redirect('back');
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
`;

// Replace checkout and procesar-pedido
const checkoutPatch = `
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
    
    db.run(\`INSERT INTO orders (user_id, customer_name, customer_phone, delivery_address, scheduled_time, total_price, status, payment_status, items) VALUES (?, ?, ?, ?, ?, ?, 'Pendiente', 'Pendiente', ?)\`, 
    [req.session.user.id, customer_name, customer_phone, delivery_address, scheduled_time, total_price, items], function(err) {
        req.session.cart = [];
        res.render('success', { orderId: this.lastID, scheduled_time, customer_name });
    });
});
`;
code = code.replace(/app\.get\('\/checkout\/:productId'[\s\S]*?\}\);/, checkoutPatch.trim());
code = code.replace(/app\.post\('\/procesar-pedido'[\s\S]*?\}\);/, "");

code = code.replace(/\/\/ RUTAS PÚBLICAS/, "// RUTAS PÚBLICAS" + newRoutes);

fs.writeFileSync('server.js', code);
console.log('server.js updated');
