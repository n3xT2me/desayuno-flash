const fs = require('fs');

const shellTop = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Desayuno Flash</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: { sans: ['Inter', 'sans-serif'] },
                    colors: {
                        brand: {
                            bg: '#F4F3FA', shell: '#F9F9FD', sidebar: '#F5F4FA',
                            accent: '#16a34a', lightAccent: '#dcfce7',
                            textPrimary: '#20202A', textSecondary: '#737486', muted: '#A3A4B4',
                            card: '#FFFFFF'
                        }
                    },
                    boxShadow: { main: '0 10px 35px rgba(80, 75, 120, 0.08)', card: '0 4px 18px rgba(80, 75, 120, 0.05)' }
                }
            }
        }
    </script>
    <style>
        body { background-color: #F4F3FA; background-image: linear-gradient(135deg, #F4F3FA 0%, #FFFFFF 100%); }
        .glass-card { background: rgba(255, 255, 255, 0.72); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.7); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #E2E1E9; border-radius: 10px; }
        .logo-bubble { transition: all 0.3s ease; }
        .logo-bubble:hover { transform: scale(1.1) rotate(5deg); }
    </style>
</head>
<body class="flex items-center justify-center min-h-screen text-brand-textPrimary">
    <div class="bg-brand-shell flex w-full h-screen overflow-hidden">
        
        <aside class="w-[64px] bg-brand-sidebar flex flex-col items-center py-5 justify-between border-r border-white">
            <div class="flex flex-col items-center gap-8">
                <a href="/" class="logo-bubble w-[40px] h-[40px] rounded-full bg-gradient-to-tr from-brand-accent to-green-400 flex items-center justify-center shadow-md shadow-green-500/40 relative">
                    <i class="fa-solid fa-leaf text-white absolute text-sm transform -translate-x-1 translate-y-1 opacity-90"></i>
                    <i class="fa-solid fa-bolt text-yellow-300 absolute text-lg transform translate-x-1 -translate-y-1"></i>
                </a>
                <nav class="flex flex-col gap-[18px] text-brand-muted">
                    <a href="/" class="w-10 h-10 rounded-xl hover:bg-white hover:text-brand-accent flex items-center justify-center transition"><i class="fa-solid fa-house"></i></a>
                    <a href="/restaurantes" class="w-10 h-10 rounded-xl hover:bg-white hover:text-brand-accent flex items-center justify-center transition"><i class="fa-solid fa-utensils"></i></a>
                    <a href="/membresias" class="w-10 h-10 rounded-xl hover:bg-white hover:text-brand-accent flex items-center justify-center transition" title="Membresías"><i class="fa-solid fa-crown"></i></a>
                    <% if(user && user.role === 'admin') { %>
                        <a href="/admin" class="w-10 h-10 rounded-xl hover:bg-white hover:text-brand-accent flex items-center justify-center transition" title="Panel"><i class="fa-solid fa-chart-line"></i></a>
                    <% } %>
                    <a href="/cart" class="w-10 h-10 rounded-xl bg-white text-brand-accent flex items-center justify-center shadow-card relative" title="Carrito">
                        <i class="fa-solid fa-cart-shopping"></i>
                        <% if(locals.cart && cart.length > 0) { %>
                            <span class="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full"><%= cart.length %></span>
                        <% } %>
                    </a>
                    <% if(user) { %>
                    <a href="/mis-pedidos" class="w-10 h-10 rounded-xl hover:bg-white hover:text-brand-accent flex items-center justify-center transition" title="Mis Pedidos"><i class="fa-solid fa-box-open"></i></a>
                    <% } %>
                </nav>
            </div>
            <div class="flex flex-col gap-4 text-brand-muted">
                <% if(user) { %>
                    <a href="/logout" class="w-10 h-10 rounded-xl hover:bg-red-50 text-red-400 flex items-center justify-center transition" title="Salir"><i class="fa-solid fa-arrow-right-from-bracket"></i></a>
                <% } else { %>
                    <a href="/login" class="w-10 h-10 rounded-xl hover:bg-white hover:text-brand-accent flex items-center justify-center transition" title="Ingresar"><i class="fa-solid fa-user"></i></a>
                <% } %>
            </div>
        </aside>

        <main class="flex-1 flex flex-col overflow-hidden">
            <div class="flex-1 overflow-y-auto p-[20px] lg:p-[40px] bg-white rounded-tl-[20px]">
                <div class="w-full max-w-[800px] mx-auto">
`;

const shellBottom = `
                </div>
            </div>
        </main>
    </div>
</body>
</html>`;

const cartContent = `
                    <div class="flex items-center gap-4 mb-8">
                        <a href="/restaurantes" class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-brand-accent hover:text-white transition"><i class="fa-solid fa-arrow-left"></i></a>
                        <div>
                            <h1 class="text-2xl font-extrabold text-gray-900">Tu Carrito</h1>
                            <p class="text-sm text-brand-textSecondary">Revisa tu pedido antes de pagar.</p>
                        </div>
                    </div>

                    <% if (!locals.cart || cart.length === 0) { %>
                        <div class="text-center py-10 glass-card rounded-[14px]">
                            <i class="fa-solid fa-basket-shopping text-4xl text-gray-300 mb-4"></i>
                            <p class="text-gray-500 mb-4">Tu carrito está vacío.</p>
                            <a href="/restaurantes" class="bg-brand-accent hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full transition">Explorar Restaurantes</a>
                        </div>
                    <% } else { %>
                        <div class="glass-card rounded-[14px] p-6 mb-6">
                            <ul class="divide-y divide-gray-100">
                                <% let total = 0; %>
                                <% cart.forEach(item => { total += item.price; %>
                                    <li class="py-4 flex justify-between items-center">
                                        <div class="flex items-center gap-4">
                                            <img src="<%= item.image_url %>" class="w-12 h-12 object-cover rounded-lg shadow-sm">
                                            <h6 class="font-bold text-gray-800 text-sm"><%= item.name %></h6>
                                        </div>
                                        <span class="font-bold text-gray-900">S/ <%= item.price.toFixed(2) %></span>
                                    </li>
                                <% }) %>
                            </ul>
                            <div class="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                                <span class="text-sm font-bold text-gray-500 uppercase">Total (PEN)</span>
                                <span class="text-xl font-extrabold text-brand-accent">S/ <%= total.toFixed(2) %></span>
                            </div>
                        </div>

                        <div class="flex justify-end gap-3">
                            <form action="/cart/clear" method="POST">
                                <button type="submit" class="px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition">Vaciar Carrito</button>
                            </form>
                            <a href="/checkout" class="bg-brand-accent hover:bg-green-700 text-white font-bold py-2 px-8 rounded-lg shadow-md transition flex items-center gap-2">
                                Continuar al Pago <i class="fa-solid fa-arrow-right"></i>
                            </a>
                        </div>
                    <% } %>
`;

const misPedidosContent = `
                    <div class="flex items-center gap-4 mb-8">
                        <div>
                            <h1 class="text-2xl font-extrabold text-gray-900">Mis Pedidos</h1>
                            <p class="text-sm text-brand-textSecondary">Historial de tus desayunos.</p>
                        </div>
                    </div>

                    <div class="flex flex-col gap-4">
                        <% if (orders.length === 0) { %>
                            <div class="text-center py-10 glass-card rounded-[14px]">
                                <i class="fa-solid fa-box-open text-4xl text-gray-300 mb-4"></i>
                                <p class="text-gray-500 mb-4">No tienes pedidos aún.</p>
                                <a href="/restaurantes" class="bg-brand-accent hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full transition">Pedir ahora</a>
                            </div>
                        <% } %>
                        <% orders.forEach(order => { %>
                            <div class="glass-card rounded-[14px] p-5 shadow-card border border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                <div>
                                    <div class="flex items-center gap-3 mb-1">
                                        <h5 class="font-bold text-gray-900">Pedido #<%= order.id %></h5>
                                        <span class="text-[10px] font-bold px-2 py-0.5 rounded-full <%= order.status === 'Entregado' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700' %>"><%= order.status %></span>
                                    </div>
                                    <p class="text-xs text-gray-500 mb-2"><i class="fa-regular fa-clock"></i> <%= new Date(order.created_at).toLocaleString() %></p>
                                    <p class="text-sm font-bold text-gray-800">Total: S/ <%= order.total_price.toFixed(2) %></p>
                                </div>
                                <div class="flex gap-2">
                                    <a href="/seguimiento/<%= order.id %>" class="bg-[#F2F1F8] hover:bg-brand-accent hover:text-white text-[#555568] px-4 py-2 rounded-lg text-xs font-semibold transition">Rastrear</a>
                                    <form action="/repetir-pedido/<%= order.id %>" method="POST" class="m-0">
                                        <button type="submit" class="bg-brand-accent hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md transition flex items-center gap-1"><i class="fa-solid fa-rotate-right"></i> Repetir</button>
                                    </form>
                                </div>
                            </div>
                        <% }) %>
                    </div>
`;

const trackingContent = `
                    <div class="flex items-center gap-4 mb-8">
                        <a href="/mis-pedidos" class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-brand-accent hover:text-white transition"><i class="fa-solid fa-arrow-left"></i></a>
                        <div>
                            <h1 class="text-2xl font-extrabold text-gray-900">Seguimiento #<%= order.id %></h1>
                            <p class="text-sm text-brand-textSecondary">Sigue el progreso de tu desayuno.</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div class="glass-card rounded-[14px] p-5">
                            <h6 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Estado de Pago</h6>
                            <div class="flex items-center gap-2">
                                <div class="w-3 h-3 rounded-full" id="payment-indicator" style="background: <%= order.payment_status === 'Aprobado' ? '#16a34a' : '#fbbf24' %>"></div>
                                <span class="font-bold text-gray-800" id="payment-status"><%= order.payment_status %></span>
                            </div>
                        </div>
                        <div class="glass-card rounded-[14px] p-5">
                            <h6 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Repartidor Asignado</h6>
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><i class="fa-solid fa-motorcycle"></i></div>
                                <span class="font-bold text-gray-800" id="driver-name"><%= order.driver_name || 'Buscando repartidor...' %></span>
                            </div>
                        </div>
                    </div>

                    <div class="glass-card rounded-[14px] p-6">
                        <h4 class="font-bold text-gray-900 mb-6">Línea de Progreso</h4>
                        
                        <div class="relative pl-6" id="status-timeline">
                            <!-- JS will render this -->
                        </div>
                    </div>

                    <script>
                        const orderId = <%= order.id %>;
                        const stages = ['Pendiente', 'Aprobado', 'Preparando', 'Listo', 'Repartidor Asignado', 'En Camino', 'Entregado'];

                        function renderTimeline(currentStatus) {
                            const container = document.getElementById('status-timeline');
                            container.innerHTML = '';
                            
                            // Line behind dots
                            const line = document.createElement('div');
                            line.className = 'absolute top-0 bottom-0 left-[11px] w-[2px] bg-gray-200 z-0';
                            container.appendChild(line);

                            let reached = true;
                            stages.forEach((stage, index) => {
                                const isCurrent = stage === currentStatus;
                                
                                const row = document.createElement('div');
                                row.className = 'relative z-10 flex items-center gap-4 mb-6 last:mb-0';
                                
                                const dotColor = reached ? (isCurrent ? 'bg-brand-accent shadow-[0_0_0_4px_rgba(22,163,74,0.2)]' : 'bg-brand-accent') : 'bg-gray-300';
                                const iconClass = reached ? 'text-white' : 'hidden';
                                const textColor = reached ? (isCurrent ? 'text-brand-accent font-extrabold' : 'text-gray-800 font-bold') : 'text-gray-400 font-medium';

                                row.innerHTML = \`
                                    <div class="w-6 h-6 rounded-full \${dotColor} flex items-center justify-center text-[10px] transition-all">
                                        <i class="fa-solid fa-check \${iconClass}"></i>
                                    </div>
                                    <div class="text-sm \${textColor}">\${stage}</div>
                                \`;
                                container.appendChild(row);
                                
                                if (isCurrent) reached = false;
                            });
                        }

                        async function fetchStatus() {
                            try {
                                const res = await fetch(\`/api/pedido/\${orderId}\`);
                                const data = await res.json();
                                
                                renderTimeline(data.status);
                                
                                const pStatus = document.getElementById('payment-status');
                                const pIndicator = document.getElementById('payment-indicator');
                                pStatus.textContent = data.payment_status;
                                pIndicator.style.background = data.payment_status === 'Aprobado' ? '#16a34a' : '#fbbf24';
                                
                                document.getElementById('driver-name').textContent = data.driver_name || 'Buscando repartidor...';
                                
                            } catch (err) { console.error(err); }
                        }

                        renderTimeline('<%= order.status %>');
                        setInterval(fetchStatus, 3000); // Poll every 3 seconds
                    </script>
`;

fs.writeFileSync('views/cart.ejs', shellTop + cartContent + shellBottom);
fs.writeFileSync('views/mis-pedidos.ejs', shellTop + misPedidosContent + shellBottom);
fs.writeFileSync('views/tracking.ejs', shellTop + trackingContent + shellBottom);

