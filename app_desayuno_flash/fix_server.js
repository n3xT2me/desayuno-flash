const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');
// Fix the extra `}); });` before procesar-pedido
code = code.replace(/app\.get\('\/checkout'[\s\S]*?\}\);\n\n\n    \}\);\n\}\);\n    \}\);\n\}\);/, `app.get('/checkout', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    if (req.session.cart.length === 0) return res.redirect('/restaurantes');
    const total = req.session.cart.reduce((sum, item) => sum + item.price, 0);
    res.render('checkout', { total });
});`);

// Fix procesar-pedido again
code = code.replace(/app\.post\('\/procesar-pedido'[\s\S]*?res\.render\('success', \{ orderId: this\.lastID, scheduled_time, customer_name \}\);\n    \}\);\n\}\);/, `app.post('/procesar-pedido', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const { customer_name, customer_phone, delivery_address, scheduled_time } = req.body;
    const total_price = req.session.cart.reduce((sum, item) => sum + item.price, 0);
    const items = JSON.stringify(req.session.cart);
    
    db.run(\`INSERT INTO orders (user_id, customer_name, customer_phone, delivery_address, scheduled_time, total_price, status, payment_status, items) VALUES (?, ?, ?, ?, ?, ?, 'Pendiente', 'Pendiente', ?)\`, 
    [req.session.user.id, customer_name, customer_phone, delivery_address, scheduled_time, total_price, items], function(err) {
        req.session.cart = [];
        res.render('success', { orderId: this.lastID, scheduled_time, customer_name });
    });
});`);

fs.writeFileSync('server.js', code);
