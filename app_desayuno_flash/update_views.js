const fs = require('fs');

const cartEjs = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Carrito - Desayuno Flash</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-danger">
        <div class="container">
            <a class="navbar-brand fw-bold" href="/">Desayuno Flash</a>
            <div class="d-flex">
                <a href="/mis-pedidos" class="btn btn-outline-light me-2">Mis Pedidos</a>
            </div>
        </div>
    </nav>

    <div class="container my-5">
        <h2>Tu Carrito</h2>
        <% if (cart.length === 0) { %>
            <p>Tu carrito está vacío. <a href="/restaurantes">Ver restaurantes</a></p>
        <% } else { %>
            <ul class="list-group mb-3">
                <% let total = 0; %>
                <% cart.forEach(item => { total += item.price; %>
                    <li class="list-group-item d-flex justify-content-between lh-sm">
                        <div>
                            <h6 class="my-0"><%= item.name %></h6>
                        </div>
                        <span class="text-muted">S/ <%= item.price.toFixed(2) %></span>
                    </li>
                <% }) %>
                <li class="list-group-item d-flex justify-content-between">
                    <span>Total (PEN)</span>
                    <strong>S/ <%= total.toFixed(2) %></strong>
                </li>
            </ul>
            <div class="d-flex gap-2">
                <form action="/cart/clear" method="POST">
                    <button type="submit" class="btn btn-secondary">Vaciar</button>
                </form>
                <a href="/checkout" class="btn btn-success">Ir a Pagar</a>
            </div>
        <% } %>
    </div>
</body>
</html>
`;
fs.writeFileSync('views/cart.ejs', cartEjs);

const misPedidosEjs = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mis Pedidos - Desayuno Flash</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <nav class="navbar navbar-expand-lg navbar-dark bg-danger">
        <div class="container">
            <a class="navbar-brand fw-bold" href="/">Desayuno Flash</a>
            <div class="d-flex">
                <a href="/cart" class="btn btn-outline-light">🛒 Carrito (<%= cart ? cart.length : 0 %>)</a>
            </div>
        </div>
    </nav>
    <div class="container my-5">
        <h2>Mis Pedidos</h2>
        <div class="list-group mt-4">
            <% if (orders.length === 0) { %>
                <p>No tienes pedidos aún.</p>
            <% } %>
            <% orders.forEach(order => { %>
                <div class="list-group-item flex-column align-items-start mb-2 border rounded">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">Pedido #<%= order.id %></h5>
                        <small><%= new Date(order.created_at).toLocaleString() %></small>
                    </div>
                    <p class="mb-1"><strong>Estado:</strong> <%= order.status %> | <strong>Pago:</strong> <%= order.payment_status %></p>
                    <p class="mb-1"><strong>Total:</strong> S/ <%= order.total_price.toFixed(2) %></p>
                    <div class="mt-2">
                        <a href="/seguimiento/<%= order.id %>" class="btn btn-sm btn-primary">Rastrear Pedido</a>
                        <form action="/repetir-pedido/<%= order.id %>" method="POST" class="d-inline">
                            <button type="submit" class="btn btn-sm btn-outline-secondary">Repetir Pedido</button>
                        </form>
                    </div>
                </div>
            <% }) %>
        </div>
    </div>
</body>
</html>
`;
fs.writeFileSync('views/mis-pedidos.ejs', misPedidosEjs);

const trackingEjs = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Seguimiento de Pedido #<%= order.id %></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .timeline { list-style: none; padding: 0; position: relative; }
        .timeline:before { top: 0; bottom: 0; position: absolute; content: " "; width: 3px; background-color: #eee; left: 20px; margin-left: -1.5px; }
        .timeline > li { margin-bottom: 20px; position: relative; }
        .timeline > li:before, .timeline > li:after { content: " "; display: table; }
        .timeline > li:after { clear: both; }
        .timeline > li > .timeline-panel { width: calc(100% - 50px); float: right; border: 1px solid #d4d4d4; border-radius: 2px; padding: 10px; position: relative; -webkit-box-shadow: 0 1px 6px rgba(0, 0, 0, 0.175); box-shadow: 0 1px 6px rgba(0, 0, 0, 0.175); }
        .timeline > li > .timeline-badge { color: #fff; width: 40px; height: 40px; line-height: 40px; font-size: 1.4em; text-align: center; position: absolute; top: 0; left: 0; background-color: #999999; z-index: 100; border-radius: 50%; }
        .timeline > li.active > .timeline-badge { background-color: #198754; }
    </style>
</head>
<body class="bg-light">
    <div class="container my-5">
        <a href="/mis-pedidos" class="btn btn-outline-secondary mb-3">&larr; Volver</a>
        <h2 class="mb-4">Seguimiento de Pedido #<%= order.id %></h2>
        
        <div class="card mb-4">
            <div class="card-body">
                <h5>Estado del Pago: <span id="payment-status" class="badge <%= order.payment_status === 'Aprobado' ? 'bg-success' : 'bg-warning' %>"><%= order.payment_status %></span></h5>
                <p><strong>Repartidor Asignado:</strong> <span id="driver-name"><%= order.driver_name || 'Buscando repartidor...' %></span></p>
            </div>
        </div>

        <h4>Mapa de Progreso</h4>
        <ul class="timeline" id="status-timeline">
            <!-- Rendered by JS -->
        </ul>
    </div>

    <script>
        const orderId = <%= order.id %>;
        const stages = ['Pendiente', 'Aprobado', 'Preparando', 'Listo', 'Repartidor Asignado', 'En Camino', 'Entregado'];

        function renderTimeline(currentStatus) {
            const container = document.getElementById('status-timeline');
            container.innerHTML = '';
            
            let reached = true;
            stages.forEach((stage, index) => {
                const li = document.createElement('li');
                if (reached) li.classList.add('active');
                
                li.innerHTML = \`
                    <div class="timeline-badge"><i class="bi bi-check"></i></div>
                    <div class="timeline-panel">
                        <div class="timeline-heading">
                            <h5 class="timeline-title">\${stage}</h5>
                        </div>
                    </div>
                \`;
                container.appendChild(li);
                
                if (stage === currentStatus) reached = false;
            });
        }

        async function fetchStatus() {
            try {
                const res = await fetch(\`/api/pedido/\${orderId}\`);
                const data = await res.json();
                
                renderTimeline(data.status);
                
                const pStatus = document.getElementById('payment-status');
                pStatus.textContent = data.payment_status;
                pStatus.className = 'badge ' + (data.payment_status === 'Aprobado' ? 'bg-success' : 'bg-warning');
                
                document.getElementById('driver-name').textContent = data.driver_name || 'Buscando repartidor...';
                
            } catch (err) { console.error(err); }
        }

        renderTimeline('<%= order.status %>');
        setInterval(fetchStatus, 3000); // Poll every 3 seconds
    </script>
</body>
</html>
`;
fs.writeFileSync('views/tracking.ejs', trackingEjs);

